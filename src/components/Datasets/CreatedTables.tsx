import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text } from '@chakra-ui/react'
const CreatedTables = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const apiUrl = import.meta.env.VITE_API_URL;
    const getTableWithId = async (t: any) => {
        const tableId = t.ID;
        console.log(tableId)
        const response = await fetch(`${apiUrl}/usertable/${tableId}/columns`, {
            method: "GET"
        })
        const data = await response.json();
        console.log(data)
        if (response.status === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns, bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: data.error })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            dispatch({ type: 'datasetTable/setCreateColumns', payload: true})
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: t.ID})
            dispatch({ type: 'datasetTable/setSelectedTableName', payload: t.Name})
            dispatch({ type: 'datasetTable/setUserId', payload: t.UserID})
        } else {
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
                            <Box onClick={() => {
                                console.log("click")
                                getTableWithId(t)
                            }} cursor={"pointer"}
                                key={`${t.ID}-table-box`}>
                                <Heading size='xs' textTransform='uppercase'>
                                    {t.Name}
                                </Heading>
                            </Box>
                        )
                    })}
                </Stack>
            </CardBody>
        </Card>
    );
}

export default CreatedTables;