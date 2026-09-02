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

    const userInfo = useSelector((state: any) => state.user)

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
        getAllDataSets()
    }, [])
    const handleRenderView = async (t: any) => {
        close()
        const dataColumns = await fetchTableWithId(t.id)
        const dataValues = await getAllColumnsWithTableId(t.id);
        //  && dataValues[1] === 200
        if (dataColumns[1] === 200) {
            dispatch({ type: 'datasetTableView/setSelectedTable', payload: dataColumns[0] })
            dispatch({ type: 'datasetTableView/setColumns', payload: dataColumns[0].columns_in_table.RawMessage })
            dispatch({ type: 'datasetTableView/setData', payload: dataValues[0] })
            dispatch({ type: 'datasetTableView/setTableName', payload: dataColumns[0].table_name })
            dispatch({ type: 'datasetTableView/setRenderTable', payload: true })
            dispatch({ type: 'datasetTableView/setTableID', payload: t.id })
        } else {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Datenbank hat keine Columns" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte hinzufügen" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        }
    }
    const close = async () => {
        setDescriptionOpen(false)
        dispatch({ type: 'datasetTableView/setColumns', payload: [] })
        dispatch({ type: 'datasetTableView/setData', payload: null })
        dispatch({ type: 'datasetTableView/setTableName', payload: null })
        dispatch({ type: 'datasetTableView/setRenderTable', payload: false })
        dispatch({ type: 'datasetTableView/setTableID', payload: null })
        dispatch({ type: 'datasetTableView/setSelectedTable', payload: null })
    }

    const [descriptionOpen, setDescriptionOpen] = useState(false);

    return (
        <Grid templateColumns={`repeat(6, 1fr)`} gap={6} width={"95vw"} height={"90vh"} padding={"0 0 2vh 0"}>
            <GridItem h='90vh' w="100%" overflowY={"auto"}>
                <VStack spacing={".5rem"} overflowX={"hidden"} height={"100%"} width={"100%"}>
                    {tables !== null && tables.length != 0 && tables.map((t: any) => {
                        const isSelected = t.id === selected;
                        return (
                            <Card minWidth={"200px"} width={"100%"} backgroundColor={isSelected ? "#ba2d0bff" : "white"}>
                                <CardBody padding={"1rem"} >
                                    <HStack spacing={".5rem"} justifyContent={"space-between"}>
                                        <Heading size='sm' > {t["table_name"]}</Heading>
                                        {!isSelected ? <Button _hover={{ backgroundColor: "#ecf39eff" }} size="sm" onClick={() => handleRenderView(t)}>View data</Button> : <Button _hover={{ backgroundColor: "#ecf39eff" }} size="sm" onClick={close}>Close</Button>}
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

            <GridItem colSpan={descriptionOpen ? 4 : 5} h='100%'>
                {renderTable
                    ? <Tables />
                    : <Box color="gray" height="100%" alignContent={"center"} textAlign={"center"}>
                        {tables !== null && tables.length != 0 ? "Select a table on the left side to view it here." : "No tables created. Create your first table inside the 'Database' section"}
                    </Box>
                }

            </GridItem>

            <GridItem display={descriptionOpen ? "block" : "none"}>
                <Card minWidth={"100%"} height={"100%"}>
                    <CardHeader>
                        <Heading size='md'>Beschreibung</Heading>
                        {descriptionOpen && <TableViewActions/>}
                    </CardHeader>
                </Card>
            </GridItem>
        </Grid>
    );
}
export default DatasetsTable;