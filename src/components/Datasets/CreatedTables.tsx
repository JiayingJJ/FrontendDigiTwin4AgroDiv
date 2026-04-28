import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
import { fetchTableWithId } from '../../api/dataset';
const CreatedTables = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)

    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
        dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
        const data = await fetchTableWithId(t)
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
                                    getTableWithId(t)
                                }} cursor={"pointer"}
                                key={`${t.ID}-table-box`}>
                                <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                    {t.TableName}
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