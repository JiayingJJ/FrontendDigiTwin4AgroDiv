import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { MdDeleteForever } from "react-icons/md";
import ModalComponent from '../ModalComponent';
import { databaseSqlite } from '../sqlite/db';
import { deleteTableWithId, fetchTableWithId, getTablesWithUserId } from '../../api/userTables';
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

        if (isOnLine) {
            const data = await fetchTableWithId(t.id)
            if (data[1] === 500) {
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
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: tableData[0].id })
            dispatch({ type: 'datasetTable/setTableColumns', payload: JSON.parse(tableData[0].columns_in_table) })
        }
    }
    const handleDeleteTable = async (t: any) => {
        setTableId(t.ID)
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Datenbank löschen" })
        dispatch({ type: 'modalInfo/setModalBody', payload: `Wollen Sie Datenbank ${t.table_name} löschen?` })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
    }
    const clickOnSaveBtn = async () => {
        const dataDelete = await deleteTableWithId(tableId);
        const data = await getTablesWithUserId(userInfo)
        const filterData = data.filter((d) => {
            if (!d.deleted_at.Valid) {
                return d;
            }
        });
        dispatch({ type: 'datasetTable/setTables', payload: filterData })
    }
    const clickOnCancelBtn = () => {
    }

    return (
        <>
            <Card width={"100%"} textAlign={"center"}>
                <CardHeader>
                    <Heading size='md'>Angelegte Datenbanken</Heading>
                </CardHeader>
                <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
            </Card>

            <VStack spacing={".5rem"} overflowX={"hidden"} height={"100%"} width={"100%"}>
                {tables?.map((t: any) => {
                    return (
                        <Card minWidth={"200px"} width={"100%"}>
                            <CardBody padding={"1rem"}>
                                <HStack spacing={".5rem"} justifyContent={"space-between"}>
                                    <Button
                                        disabled={addingColumns}
                                        backgroundColor={selectedTableId === t.id ? "red" : "white"}
                                        onClick={() => {
                                            getTableWithId(t)
                                        }} cursor={"pointer"}
                                        key={`${t.id}-table-box`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {t.table_name}
                                        </Heading>
                                    </Button>
                                    <Box style={{ display: "flex", alignItems: "center" }}>
                                        <MdDeleteForever cursor={"pointer"} onClick={() => handleDeleteTable(t)} size="25" />
                                    </Box>
                                </HStack>
                            </CardBody>
                        </Card>)
                })}
            </VStack>
        </>
    );
}

export default CreatedTables;