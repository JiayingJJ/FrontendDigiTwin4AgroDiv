import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
const CreatedTables = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)

    const apiUrl = import.meta.env.VITE_API_URL;
    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
        const tableId = t.ID;
        const response = await fetch(`${apiUrl}/usertable/${tableId}/columns`, {
            method: "GET"
        })
        const data = await response.json();
        console.log(data)
        if (response.status === 500) {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns, bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: data.error })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: true })
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: t.ID })
            dispatch({ type: 'datasetTable/setSelectedTableName', payload: t.Name })
            dispatch({ type: 'datasetTable/setUserId', payload: t.UserID })
        } else {
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: data.TableID })
            dispatch({ type: 'datasetTable/setTableColumns', payload: data.Columns })
        }
    }
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>Erstellte Datenbank</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    {tables?.map((t: any) => {
                        return (
                            <Button
                                disabled={addingColumns}
                                backgroundColor={selectedTableId === t.ID ? "red" : "white"}
                                onClick={() => {
                                    console.log("click")
                                    dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
                                    dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
                                    getTableWithId(t)
                                }} cursor={"pointer"}
                                key={`${t.ID}-table-box`}>
                                <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                    {t.Name}
                                </Heading>
                            </Button>
                        )
                    })}
                </Stack>
            </CardBody>
        </Card>
    );
}

export default CreatedTables;