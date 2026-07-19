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
const TablesActionForView = () => {
    const dispatch = useDispatch()
    const handleSwitchToDatabasePage = () => {
        dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })
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