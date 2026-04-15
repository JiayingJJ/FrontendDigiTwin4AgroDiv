import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
import { FiPlusCircle } from "react-icons/fi";
import { CiCircleRemove } from "react-icons/ci";

import ColumnsComponent from './ColumnsComponent';
import { v4 as uuidv4 } from 'uuid';
import ModalComponent from '../ModalComponent';
import { postUserColumns } from '../../api/dataset';
const CreateColumns = () => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const modalResult = useSelector((state: any) => state.modalInfo.modalResult)


    const addColumns = (type: string) => {
        console.log(type)
        dispatch({ type: 'datasetTable/addUserTableColumns', payload: { id: uuidv4(), name: "", type: type, position: userTableColumns.length } })
        dispatch({ type: 'datasetTable/setUserTableColumnIndex', payload: 1 })

    }

    const clickOnSaveBtn = () => {
        dispatch({ type: 'datasetTable/clearUserTableColumns', payload: [] })
        dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
    }
    const clickOnCancelBtn = () => {
    }
    return (
        <>
            <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" 
            onClick={() => dispatch({ type: 'datasetTable/setAddingColumns', payload: true })} />
            {addingColumns && <CiCircleRemove color="green" size="40" onClick={() => {
                console.log(userTableColumns.length)
                if(userTableColumns.length !== 0){
                dispatch({ type: 'modalInfo/setShowModal', payload: true })
                dispatch({ type: 'modalInfo/setModalHeader', payload: "Nicht gespeicherte Informationen" })
                dispatch({ type: 'modalInfo/setModalBody', payload: "Wollen Sie die Änderung verwerfen?" })
                dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
                }
                console.log("modalResult: ", modalResult)
                
                }}/>}
            {addingColumns && <Box>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("select")}>Select</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("text")}>Input</Button>
            </Box>}
            {userTableColumns.length !== 0 ? <ColumnsComponent postUserColumns={() => postUserColumns(tableId, userTableColumns)} /> : null}
            <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn}/>
        </>
    );
}

export default CreateColumns;