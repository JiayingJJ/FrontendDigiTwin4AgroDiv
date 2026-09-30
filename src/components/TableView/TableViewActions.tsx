import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    VStack, Button,
} from '@chakra-ui/react'
import {
    FiDownload, FiPlus, FiEdit, FiTrash2,
} from "react-icons/fi";
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
        <VStack spacing={2} width="100%">
            <Button
                size="sm"
                width="100%"
                leftIcon={<FiDownload />}
                colorScheme="blue"
                variant="outline"
                onClick={handleClickDownload}
                isDisabled={editData || deleteData}
                _hover={{
                    bg: "blue.50",
                    transform: "translateY(-1px)",
                }}
            >
                Download
            </Button>

            <Button
                size="sm"
                width="100%"
                leftIcon={<FiPlus />}
                colorScheme="green"
                variant="outline"
                onClick={handleClickAddData}
                isDisabled={editData || deleteData}
                _hover={{
                    bg: "green.50",
                    transform: "translateY(-1px)",
                }}
            >
                Add Data
            </Button>

            <Button
                size="sm"
                width="100%"
                leftIcon={<FiEdit />}
                colorScheme="orange"
                variant="outline"
                onClick={handleClickEditData}
                isDisabled={deleteData}
                _hover={{
                    bg: "orange.50",
                    transform: "translateY(-1px)",
                }}
            >
                Edit Data
            </Button>

            <Button
                size="sm"
                width="100%"
                leftIcon={<FiTrash2 />}
                colorScheme="red"
                variant="outline"
                onClick={handleClickDeleteData}
                isDisabled={editData}
                _hover={{
                    bg: "red.50",
                    transform: "translateY(-1px)",
                }}
            >
                Delete Data
            </Button>
        </VStack>
    );
}

export default TableViewActions;