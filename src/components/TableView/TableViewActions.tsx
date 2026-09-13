import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button
} from '@chakra-ui/react'
import { getReport } from '../../api/report';
const TableViewActions = () => {
    const dispatch = useDispatch()
    const addNewColumnsDataInDatasetTableView = useSelector((state: any) => state.datasetTableView.addNewColumnsDataInDatasetTableView)
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)

    const handleClickDownload = async () => {
        dispatch({ type: 'datasetTableView/setRedernSelectColumn', payload: true })
    }

    const handleClickAddData = async () => {
        console.log("rendern")
        dispatch({ type: 'datasetTableView/setAddNewColumnsDataInDatasetTableView', payload: true })
        dispatch({ type: 'datasetTable/setSelectedTableId', payload: selectedTable.id })
        dispatch({ type: 'datasetTable/setSelectedTable', payload: selectedTable })
        dispatch({ type: 'datasetTable/setTableColumns', payload: selectedTable.columns_in_table.RawMessage })
        dispatch({ type: 'datasetTable/setUserInputColumnValues', payload: selectedTable.columns_in_table.RawMessage })
    }
    return (
        <>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickDownload()}>Download</Button>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickAddData()}>Add Data</Button>
        </>
    );
}

export default TableViewActions;