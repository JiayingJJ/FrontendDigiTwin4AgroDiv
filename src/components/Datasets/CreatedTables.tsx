import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { deleteTableWithId, fetchTableWithId, getTablesWithUserId } from '../../api/dataset';
import { MdDeleteForever } from "react-icons/md";
import ModalComponent from '../ModalComponent';
const CreatedTables = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const userInfo = useSelector((state: any) => state.user)
    const [tableId, setTableId] = useState<string | null>(null);
    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
        dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })

        const data = await fetchTableWithId(t.ID)
        console.log(data)
        if (data[1] === 500) {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: true })
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: t.ID })
            dispatch({ type: 'datasetTable/setSelectedTableName', payload: t.Name })
            dispatch({ type: 'datasetTable/setUserId', payload: t.UserID })
        } else {
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: data[0].ID })
            dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].ColumnsInTable.RawMessage })
        }
    }
    const handleDeleteTable = async (t: any) => {
        setTableId(t.ID)
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Datenbank löschen" })
        dispatch({ type: 'modalInfo/setModalBody', payload: `Wollen Sie Datenbank ${t.TableName} löschen?` })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
    }
    const clickOnSaveBtn = async () => {
        const dataDelete = await deleteTableWithId(tableId);
        console.log(dataDelete)
        const data = await getTablesWithUserId(userInfo)
        const filterData = data.filter((d) => {
            if (!d.DeletedAt.Valid) {
                return d;
            }
        });
        console.log(filterData)
        dispatch({ type: 'datasetTable/setTables', payload: filterData })
        console.log(data)
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
                                        backgroundColor={selectedTableId === t.ID ? "red" : "white"}
                                        onClick={() => {
                                            getTableWithId(t)
                                        }} cursor={"pointer"}
                                        key={`${t.ID}-table-box`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {t.TableName}
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