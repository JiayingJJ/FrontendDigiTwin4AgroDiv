import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
import { fetchTableWithId } from '../../api/dataset';
import DatasetColumns from './DatasetsInMaps/DatasetColumns';

const AddDataInTable = () => {
    const dispatch = useDispatch()

    const tables = useSelector((state: any) => state.datasetTable.tables)
    console.log(tables)
    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/clearUserInputColumnValues', payload: [] })
        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
        dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
        const data = await fetchTableWithId(t.id)
        console.log(data)
        if (data[1] === 500) {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte in Datenbank Seite Columns hinzufügen " })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: true })
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: t.id })
            dispatch({ type: 'datasetTable/setSelectedTableName', payload: t.table_name })
            dispatch({ type: 'datasetTable/setUserId', payload: t.user_id })
        } else {
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: data[0].id })
            dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].columns_in_table.RawMessage })
            dispatch({ type: 'datasetTable/setUserInputColumnValues', payload: data[0].columns_in_table.RawMessage })
        }
    }
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>Verfügbare Datenbank</Heading>
            </CardHeader>

            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    {tables?.map((t: any) => {
                        console.log(t)
                        return (
                            <Button
                                onClick={() => {
                                    console.log(t)
                                    getTableWithId(t)
                                }} cursor={"pointer"}
                                key={`${t.ID}-table-box`}>
                                <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                    {t.table_name}
                                </Heading>
                            </Button>
                        )
                    })}
                </Stack>
            </CardBody>
            <DatasetColumns />
        </Card>
    );
}

export default AddDataInTable;