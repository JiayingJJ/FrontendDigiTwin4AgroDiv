import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack } from '@chakra-ui/react'
import { FiPlusCircle } from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";

import ColumnsComponent from './ColumnsComponent';
import { v4 as uuidv4 } from 'uuid';
import ModalComponent from '../ModalComponent';
import { fetchTableWithId, patchColumns, postColumns, putNewColumns } from '../../api/dataset';
const CreateColumns = () => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const editTable = useSelector((state: any) => state.datasetTable.editTable)
    const modalResult = useSelector((state: any) => state.modalInfo.modalResult)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)
    const editedColumns = useSelector((state: any) => state.datasetTable.editedColumns)
    const removedColumns = useSelector((state: any) => state.datasetTable.removedColumns)
    const hasChanged = useSelector((state: any) => state.datasetTable.hasChanged)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const addColumns = (type: string) => {
        const newId = uuidv4()
        dispatch({ type: 'datasetTable/addUserTableColumns', payload: { id: newId, name: "", type: type, position: userTableColumns.length } })
        dispatch({ type: 'datasetTable/setUserTableColumnIndex', payload: 1 })
        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: newId })
    }

    const clickOnSaveBtn = () => {
        dispatch({ type: 'datasetTable/clearUserTableColumns', payload: [] })
        dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
    }
    const clickOnCancelBtn = () => {
    }
    const handlePostColumns = async () => {
        console.log("Post columns in Backend")

        const postData = await postColumns(tableId, userTableColumns)
        if (tableColumns.length !== 0 && newColumns.length !== 0) {
            console.log(newColumns)

            const putData = await putNewColumns(tableId, newColumns)
            console.log(putData)
        }
        if (tableColumns.length !== 0 && editedColumns.length !== 0) {
            console.log("patch")
            const getOldInfo = tableColumns.filter((tc: any) => editedColumns.some((e: any) => tc.id === e.id))
            console.log(editedColumns)
            console.log(getOldInfo)
            const result = editedColumns.map((editedC: any) => {
                const newInfo = getOldInfo.find((old: any) => old.id === editedC.id);
                return {
                    id: editedC.id,
                    old_name: newInfo?.name,
                    new_name: editedC.name ?? null
                };
            });

            console.log(result);
            const patchData = await patchColumns(tableId, result)
            console.log(patchData)
        }

        if (tableColumns.length !== 0 && removedColumns.length !== 0) {
            const result = await removedColumns(tableId, removedColumns)
            console.log(result)
        }
        console.log(postData)
        dispatch({ type: 'datasetTable/setEditTable', payload: false })

        dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
        const data = await fetchTableWithId(tableId)
        console.log(data)
        if (data[1] !== 500) {
            dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].columns_in_table.RawMessage })
            dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        }
    }
    return (
        <>
            {editTable === false && <FiPlusCircle style={{ padding: "5px", margin: "5px", zIndex: "1000" }} size="30" cursor={"pointer"}
                onClick={() => dispatch({ type: 'datasetTable/setAddingColumns', payload: true })} />}
            {((addingColumns && !editTable && userTableColumns.length !== 0) || (!addingColumns && editTable && userTableColumns.length !== 0)) ? <ColumnsComponent /> : null}
            {(addingColumns || editTable) && <HStack spacing={".5rem"}>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("select")}>Add a Select column</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("text")}>Add an Input column</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} disabled={!hasChanged} onClick={() => handlePostColumns()}>Submit</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => {
                    if (userTableColumns.length !== 0) {
                        dispatch({ type: 'modalInfo/setShowModal', payload: true })
                        dispatch({ type: 'modalInfo/setModalHeader', payload: "Nicht gespeicherte Informationen" })
                        dispatch({ type: 'modalInfo/setModalBody', payload: "Wollen Sie die Änderung verwerfen?" })
                        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
                    } else {
                        dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
                        dispatch({ type: 'datasetTable/setEditTable', payload: false })
                    }
                }}>Cancel</Button>
            </HStack>}
            <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
        </>
    );
}

export default CreateColumns;