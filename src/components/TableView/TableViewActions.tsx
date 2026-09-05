import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button
} from '@chakra-ui/react'
import { getReport } from '../../api/report';
const TableViewActions = () => {
    const dispatch = useDispatch()

    const handleClickDownload = async () => {
        dispatch({ type: 'datasetTableView/setRedernSelectColumn', payload: true })
    }
    return (
        <>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickDownload()}>Download</Button>
        </>
    );
}

export default TableViewActions;