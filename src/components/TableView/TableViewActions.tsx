import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button
} from '@chakra-ui/react'
const TableViewActions = () => {
    const dispatch = useDispatch()
    const addNewColumnsDataInDatasetTableView = useSelector((state: any) => state.datasetTableView.addNewColumnsDataInDatasetTableView)
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)
    const editData = useSelector((state: any) => state.datasetTableView.editData);
    const deleteData = useSelector((state: any) => state.datasetTableView.deleteData);

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

    const handleClickEditData = async () => {
        dispatch({ type: 'datasetTableView/setDeleteData', payload: false })
        dispatch({ type: 'datasetTableView/setEditData', payload: true })
    }

    const handleClickDeleteData = async () => {
        dispatch({ type: 'datasetTableView/setEditData', payload: false })
        dispatch({ type: 'datasetTableView/setDeleteData', payload: true })
    }
    return (
        <>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickDownload()} disabled={editData||deleteData}>Download</Button>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickAddData()} disabled={editData||deleteData}>Add Data</Button>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickEditData()} disabled={deleteData}>Edit Data</Button>
            <Button size="sm" _hover={{ backgroundColor: "#ecf39eff" }} width={"100%"} onClick={() => handleClickDeleteData()} disabled={editData}>Delete Data</Button>
        </>
    );
}

export default TableViewActions;