import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button
} from '@chakra-ui/react'
import { getReport } from '../../api/report';
const TableViewActions = () => {
        const dispatch = useDispatch()
            const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)
        
    const handleClickDownload = async() => {
        console.log("click for download")
        const data = await getReport(selectedTable.id)
    }
    return ( 
        <>
        <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickDownload()}>Download</Button>
        </>
     );
}

export default TableViewActions;