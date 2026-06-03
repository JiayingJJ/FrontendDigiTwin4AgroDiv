import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
import { FiPlusCircle } from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";

import ColumnsComponent from './ColumnsComponent';
import { v4 as uuidv4 } from 'uuid';
import ModalComponent from '../ModalComponent';
const CreateColumns = () => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const editTable = useSelector((state: any) => state.datasetTable.editTable)
    const modalResult = useSelector((state: any) => state.modalInfo.modalResult)
    const isChangingColumns = useSelector((state: any) => state.datasetTable.isChangingColumns)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)
    const editedColumns = useSelector((state: any) => state.datasetTable.editedColumns)
    const removedColumns = useSelector((state: any) => state.datasetTable.removedColumns)
    useEffect(() => {
        if (isChangingColumns.length === 0 && (newColumns.length !== 0 || editedColumns.length !== 0 || removedColumns.length !== 0)) {
            dispatch({ type: 'datasetTable/setHasChanged', payload: true })
        } else {
            dispatch({ type: 'datasetTable/setHasChanged', payload: false })
        }
    }, [isChangingColumns])
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
    return (
        <>
            {!editTable && <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30"
                onClick={() => dispatch({ type: 'datasetTable/setAddingColumns', payload: true })} />}
            {addingColumns && <CiCircleRemove color="green" size="40" onClick={() => {
                console.log(userTableColumns.length)
                if (userTableColumns.length !== 0) {
                    dispatch({ type: 'modalInfo/setShowModal', payload: true })
                    dispatch({ type: 'modalInfo/setModalHeader', payload: "Nicht gespeicherte Informationen" })
                    dispatch({ type: 'modalInfo/setModalBody', payload: "Wollen Sie die Änderung verwerfen?" })
                    dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
                }
                console.log("modalResult: ", modalResult)

            }} />}
            {(addingColumns || editTable) && <Box>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("select")}>Select</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("text")}>Input</Button>
            </Box>}
            {((addingColumns && !editTable && userTableColumns.length !== 0) || (!addingColumns && editTable && userTableColumns.length !== 0)) ? <ColumnsComponent /> : null}
            <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
        </>
    );
}

export default CreateColumns;