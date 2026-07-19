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
const TablesActionForView = () => {
    const dispatch = useDispatch()
    const selectedUserTables = useSelector((state: any) => state.projects.selectedUserTables)

    const handleSwitchToDatabasePage = async () => {
        dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })
        dispatch({ type: 'datasetTable/setSelectedTable', payload: selectedUserTables })
        dispatch({ type: 'datasetTable/setSelectedTableId', payload: selectedUserTables.id })
        dispatch({ type: 'datasetTable/setTableColumns', payload: selectedUserTables.columns_in_table.RawMessage })
    }
    const handleSwitchToDataPage = () => {
        dispatch({ type: 'pageInfo/setPageName', payload: "tableview" })
    }
    return (
        <HStack>
            <FaTable onClick={() => handleSwitchToDatabasePage()} />
            <FaDatabase onClick={() => handleSwitchToDataPage()} />
        </HStack>
    );
}

export default TablesActionForView;