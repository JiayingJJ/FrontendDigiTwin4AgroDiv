import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card, CardHeader, CardBody, CardFooter, Heading, Text, Button, SimpleGrid, VStack, HStack,
    Box,
    Grid,
    GridItem,
    useMediaQuery
} from '@chakra-ui/react'
import { getAllColumnsWithTableId, getColumnWithId } from '../../api/dataset';
import Tables from './Tables';
import { databaseSqlite } from '../sqlite/db';
import { fetchTableWithId, getTablesWithUserId } from '../../api/userTables';
import TableViewActions from './TableViewActions';
import SelectColumn from './SelectColumn';
import DatasetColumns from '../Maps/DatasetsInMaps/DatasetColumns';
// @flow
type Props = {

};
type State = {

};
const DatasetsTable = () => {
    const dispatch = useDispatch()
    const tables = useSelector((state: any) => state.datasetTableView.tables)
    const renderTable = useSelector((state: any) => state.datasetTableView.renderTable)
    const selected = useSelector((state: any) => state.datasetTableView.tableID)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)
    const getUpdateFromDatabase = useSelector((state: any) => state.datasetTableView.getUpdateFromDatabase)
    const tableID = useSelector((state: any) => state.datasetTableView.tableID)
    const userInfo = useSelector((state: any) => state.user)
    const databaseColumns = ["id", "user_id", "geo_data_id", "data_status", "created_at", "deleted_at", "updated_at"]
    const getAllDataSets = async () => {
        let data;
        if (isOnLine) {
            data = await getTablesWithUserId(userInfo)
            console.log(data)
            dispatch({ type: 'datasetTableView/setTables', payload: data })
        } else {
            await databaseSqlite.initDb();
            data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
            console.log(data)
        }

        return data;
    }
    useEffect(() => {
        dispatch({ type: 'datasetTableView/clearDatasetTableView', payload: null })
        getAllDataSets()
    }, [])
    useEffect(() => {
        if (getUpdateFromDatabase) {
            dispatch({ type: 'datasetTableView/setData', payload: null })
            handleRenderView(tableID)
            dispatch({ type: 'datasetTableView/setGetUpdateFromDatabase', payload: false })
        }
    }, [getUpdateFromDatabase])
    useEffect(() => {
        if (selectedTable !== null && selectedTable.columns_in_table.RawMessage !== null) {
            dispatch({ type: 'datasetTable/clearInfoForASelectedTable', payload: null })
            selectedTable.columns_in_table.RawMessage.map((c: any) => {
                dispatch({ type: 'datasetTableView/addAllColumnsName', payload: c.name })
            })
            databaseColumns.map((c: string) => {
                dispatch({ type: 'datasetTableView/addAllColumnsName', payload: c })
            })
            dispatch({ type: 'datasetTable/setSelectedTableId', payload: selectedTable.id })
            dispatch({ type: 'datasetTable/setSelectedTable', payload: selectedTable })
            dispatch({ type: 'datasetTable/setTableColumns', payload: selectedTable.columns_in_table.RawMessage })
            // dispatch({ type: 'datasetTable/setUserInputColumnValues', payload: selectedTable.columns_in_table.RawMessage })
        }
    }, [selectedTable])
    const handleRenderView = async (t: String) => {
        const dataColumns = await fetchTableWithId(t)
        const dataValues = await getAllColumnsWithTableId(t);
        //  && dataValues[1] === 200
        if (dataColumns[1] === 200) {
            dispatch({ type: 'datasetTableView/setSelectedTable', payload: dataColumns[0] })
            dispatch({ type: 'datasetTableView/setColumns', payload: dataColumns[0].columns_in_table.RawMessage })
            dispatch({ type: 'datasetTableView/setData', payload: dataValues[0] })
            dispatch({ type: 'datasetTableView/setTableName', payload: dataColumns[0].table_name })
            dispatch({ type: 'datasetTableView/setRenderTable', payload: true })
            dispatch({ type: 'datasetTableView/setTableID', payload: t })
        } else {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        }
    }
    const handleClear = async () => {
        setDescriptionOpen(false)
        dispatch({ type: 'datasetTableView/clearTableInfo', payload: null })
    }

    const [descriptionOpen, setDescriptionOpen] = useState(false);

    return (
        <Grid templateColumns={`repeat(6, 1fr)`} gap={6} width={"95vw"} height={"90vh"} padding={"0 0 2vh 0"}>
            <GridItem h='90vh' w="100%" overflowY={"auto"}>
                <VStack spacing={".5rem"} overflowX={"hidden"} height={"90vh"} width={"100%"}>
                    {tables !== null && tables.length != 0 && tables.map((t: any) => {
                        const isSelected = t.id === selected;
                        return (
                            <Card minWidth={"200px"} width={"100%"} backgroundColor={isSelected ? "#ba2d0bff" : "white"}>
                                <CardBody padding={"1rem"} >
                                    <HStack spacing={".5rem"} justifyContent={"space-between"}>
                                        <Heading size='sm' > {t["table_name"]}</Heading>
                                        {!isSelected ? <Button _hover={{ backgroundColor: "#ecf39eff" }} size="sm" onClick={() => {
                                            handleClear()
                                            handleRenderView(t.id)
                                        }}>View data</Button> : <Button _hover={{ backgroundColor: "#ecf39eff" }} size="sm" onClick={close}>Close</Button>}
                                    </HStack>
                                    {isSelected ? <VStack marginTop={".5rem"} spacing={".5rem"} justifyContent={"left"} width={"100%"}>
                                        <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => setDescriptionOpen(!descriptionOpen)}>{descriptionOpen ? "Hide description" : "Show description"}</Button>
                                        {/* <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => console.log("TODO: Show Map view with this data seleted")}>{"Show on map"}</Button> */}
                                    </VStack> : null}
                                </CardBody>
                            </Card>
                        )
                    })}
                </VStack>
            </GridItem>

            <GridItem colSpan={descriptionOpen ? 4 : 5} h='90vh'>
                {renderTable
                    ? <Tables />
                    : <Box color="gray" height="90vh" alignContent={"center"} textAlign={"center"}>
                        {tables !== null && tables.length != 0 ? "Select a table on the left side to view it here." : "No tables created. Create your first table inside the 'Database' section"}
                    </Box>
                }
                <SelectColumn />
            </GridItem>

            <GridItem display={descriptionOpen ? "block" : "none"}>
                <Card minWidth={"100%"} height={"90%"}>
                    <CardHeader>
                        <Heading size='md'>Beschreibung</Heading>
                        {descriptionOpen && <TableViewActions />}
                        <DatasetColumns />
                    </CardHeader>
                </Card>
            </GridItem>
        </Grid>
    );
}
export default DatasetsTable;