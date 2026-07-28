import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import DatasetColumns from './DatasetsInMaps/DatasetColumns';
import { fetchTableWithId } from '../../api/userTables';
import { databaseSqlite } from '../sqlite/db';

const AddDataInTable = () => {
    const dispatch = useDispatch()
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const userInfo = useSelector((state: any) => state.user)

    const tables = useSelector((state: any) => state.datasetTable.tables)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const getTableWithId = async (t: any) => {
        dispatch({ type: 'datasetTable/clearUserInputColumnValues', payload: [] })
        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
        dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
        if (isOnLine) {
            const data = await fetchTableWithId(t.id)
            console.log(data)
            if (data[0] === undefined || data[1] === 500 || data[0].columns_in_table.RawMessage === null) {
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
        } else {
            await databaseSqlite.initDb()
            const data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
            const tableData = data.filter((i: any) => i.id === t.id)
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: tableData[0].id })
            dispatch({ type: 'datasetTable/setTableColumns', payload: JSON.parse(tableData[0].columns_in_table) })
            dispatch({ type: 'datasetTable/setUserInputColumnValues', payload: JSON.parse(tableData[0].columns_in_table) })
        }

    }
    return (
        <VStack spacing={".5rem"} overflowX={"hidden"} height={"auto"} width={"100%"} paddingTop={"10px"}>
                <Heading style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}  backgroundColor={"#90a955ff"} width={"100%"} border={"5px"} borderRadius={"5px"} py={"13px"} paddingLeft={"5px"} size='md'>Verfügbare Datenbank</Heading>
                <Stack divider={<StackDivider borderColor='#90a955ff' />} spacing={2}>
                    {tables?.map((t: any) => {
                        console.log(t)
                        return (
                            <Button
                                onClick={() => {
                                    getTableWithId(t)
                                }} cursor={"pointer"}
                                key={`${t.id}-table-box-add`}
                                marginTop={"2px"}
                                width={"100%"}
                                backgroundColor={selectedTableId === t.id ? "#ba2d0bff" : "#F7EDE2"}>
                                <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                    {t.table_name}
                                </Heading>
                            </Button>
                        )
                    })}
                </Stack>
            <DatasetColumns />
        </VStack>
    );
}

export default AddDataInTable;