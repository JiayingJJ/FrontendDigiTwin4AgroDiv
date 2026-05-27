import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, SimpleGrid, VStack, HStack
} from '@chakra-ui/react'
import { fetchTableWithId, getAllColumnsWithTableId, getColumnWithId, getTablesWithUserId } from '../../api/dataset';
import Tables from './Tables';
import { ascending } from 'ol/array';
// @flow
type Props = {

};
type State = {

};
const DatasetsTable = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTableView.tables)
    const renderTable = useSelector((state: any) => state.datasetTableView.renderTable)

    const userInfo = useSelector((state: any) => state.user)

    const getAllDataSets = async () => {
        const data = await getTablesWithUserId(userInfo)
        console.log(data)
        dispatch({ type: 'datasetTableView/setTables', payload: data })
        return data;
    }
    useEffect(() => {

        getAllDataSets()
    }, [])
    console.log(tables)
    const handleRenderView = async (t: any) => {
        dispatch({ type: 'datasetTableView/setColumns', payload: [] })
        dispatch({ type: 'datasetTableView/setData', payload: null })
        dispatch({ type: 'datasetTableView/setTableName', payload: null })
        dispatch({ type: 'datasetTableView/setRenderTable', payload: false })
        const dataColumns = await fetchTableWithId(t.ID)
        const dataValues = await getAllColumnsWithTableId(t.ID);
        console.log(dataColumns)
        console.log(dataValues)
        console.log(dataValues[0])
        if (dataColumns[1] === 200 && dataValues[1] === 200) {
            dispatch({ type: 'datasetTableView/setColumns', payload: dataColumns[0].ColumnsInTable.RawMessage })
            dispatch({ type: 'datasetTableView/setData', payload: dataValues[0] })
            dispatch({ type: 'datasetTableView/setTableName', payload: dataColumns[0].TableName })
            dispatch({ type: 'datasetTableView/setRenderTable', payload: true })
        } else {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        }
    }

    return (
        <VStack>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {tables !== null && tables.length != 0 && tables.map((t: any) => {
                    return (
                        <Card>
                            <CardHeader>
                                <Heading size='md'> {t.TableName}</Heading>
                            </CardHeader>
                            <CardFooter>
                                <Button onClick={() => handleRenderView(t)}>View</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </SimpleGrid>
            {renderTable && <Tables />}
        </VStack>
    );
}
export default DatasetsTable;