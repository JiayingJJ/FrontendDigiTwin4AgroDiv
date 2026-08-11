import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardBody, Box, Button, HStack, VStack } from '@chakra-ui/react'
import { MdDeleteForever } from "react-icons/md";
import { databaseSqlite } from '../sqlite/db';
import { fetchTableWithId } from '../../api/userTables';
const CreatedTables = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const userInfo = useSelector((state: any) => state.user)
    const [tableId, setTableId] = useState<string | null>(null);
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
        dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
        dispatch({ type: 'datasetTable/setSelectedTable', payload: [] })

        if (isOnLine) {
            const data = await fetchTableWithId(t.id)
            dispatch({ type: 'datasetTable/setSelectedTable', payload: data[0] })
            if (data[1] === 500 || data[0].columns_in_table.RawMessage === null) {
                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte hinzufügen" })
                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
                dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: true })
                dispatch({ type: 'datasetTable/setSelectedTableId', payload: t.id })
                dispatch({ type: 'datasetTable/setSelectedTableName', payload: t.name })
                dispatch({ type: 'datasetTable/setUserId', payload: t.user_id })
            } else {
                dispatch({ type: 'datasetTable/setSelectedTableId', payload: data[0].id })
                dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].columns_in_table.RawMessage })
            }
        } else {
            await databaseSqlite.initDb()
            const data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
            const tableData = data.filter((i: any) => i.id === t.id)
            dispatch({ type: 'datasetTable/setSelectedTable', payload: tableData[0] })
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: tableData[0].id })
            dispatch({ type: 'datasetTable/setTableColumns', payload: JSON.parse(tableData[0].columns_in_table) })
        }
    }
    const handleDeleteTable = async (t: any) => {
        setTableId(t.id)
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Datenbank löschen" })
        dispatch({ type: 'modalInfo/setModalBody', payload: `Wollen Sie Datenbank ${t.table_name} löschen?` })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
        dispatch({ type: 'modalInfo/setModalType', payload: "deleteTable" })
    }

    return (
        <VStack spacing={".5rem"}>
            {tables?.map((t: any) => {
                return (
                    <Card width={"100%"} key={`${t.id}-created-table`}>
                        <CardBody padding={"10px"}>
                            <HStack spacing={".3rem"} justifyContent={"space-between"}>
                                <Button
                                    width={"100%"}
                                    textTransform='uppercase'
                                    whiteSpace={"wrap"}
                                    disabled={addingColumns}
                                    backgroundColor={selectedTableId === t.id ? "#ba2d0bff" : "white"}
                                    onClick={() => {
                                        getTableWithId(t)
                                    }}
                                    key={`${t.id}-table-box-created`}>
                                    {t.table_name}
                                </Button>
                                <Box style={{ display: "flex", alignItems: "center" }}>
                                    <MdDeleteForever cursor={"pointer"} onClick={() => handleDeleteTable(t)} size="25" />
                                </Box>
                            </HStack>
                        </CardBody>
                    </Card>)
            })}
        </VStack>
    );
}

export default CreatedTables;