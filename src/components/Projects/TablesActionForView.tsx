import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaTable, FaDatabase } from "react-icons/fa";
import {
    Box,
    HStack,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    StackDivider,
    Stack,
    Text,
    IconButton,
    Badge
} from '@chakra-ui/react'
import { fetchTableWithId } from '../../api/userTables';
import { getAllColumnsWithTableId } from '../../api/dataset';
const TablesActionForView = () => {
    const dispatch = useDispatch()
    const selectedUserTable = useSelector((state: any) => state.projects.selectedUserTable)

    const handleSwitchToDatabasePage = async () => {
        dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })
        dispatch({ type: 'datasetTable/setSelectedTable', payload: selectedUserTable })
        dispatch({ type: 'datasetTable/setSelectedTableId', payload: selectedUserTable.id })
        dispatch({ type: 'datasetTable/setTableColumns', payload: selectedUserTable.columns_in_table.RawMessage })
    }
    const handleSwitchToDataPage = async () => {
        dispatch({ type: 'pageInfo/setPageName', payload: "tableview" })
        const dataColumns = await fetchTableWithId(selectedUserTable.id)
        const dataValues = await getAllColumnsWithTableId(selectedUserTable.id)
        dispatch({ type: 'datasetTableView/setColumns', payload: dataColumns[0].columns_in_table.RawMessage })
        dispatch({ type: 'datasetTableView/setData', payload: dataValues[0] })
        dispatch({ type: 'datasetTableView/setTableName', payload: dataColumns[0].table_name })
        dispatch({ type: 'datasetTableView/setRenderTable', payload: true })
        dispatch({ type: 'datasetTableView/setTableID', payload: selectedUserTable.id })
    }
    return (
        <HStack>
            <FaTable onClick={() => handleSwitchToDatabasePage()} />
            <FaDatabase onClick={() => handleSwitchToDataPage()} />
        </HStack>
    );
}

export default TablesActionForView;