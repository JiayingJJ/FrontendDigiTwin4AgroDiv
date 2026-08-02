import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { MdDeleteForever } from "react-icons/md";
import ModalComponent from '../../ModalComponent';
import { getColumnWithId } from '../../../api/dataset';
import { fetchTableWithId } from '../../../api/userTables';
import { deleteGeoDataWithId, setGeoDataStatus } from '../../../api/geoData';
import { FiPlusCircle } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { removeDataFromUserTablesId } from '../../../api/userTableId';
import { readableTimestamp } from '../../../helpers';
const AllInfoForDrawedInTable = () => {

    const dispatch = useDispatch()
    const allInfoInProperties = useSelector((state: any) => state.openLayers.allInfoInProperties)
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const selectedPropertiesFromDatabase = useSelector((state: any) => state.openLayers.selectedPropertiesFromDatabase)
    const columnInfo = useSelector((state: any) => state.openLayers.columnInfo)

    const clickOnSaveBtn = async () => {

    }
    const clickOnCancelBtn = () => {
    }
    const handleDeleteGeoData = async (id: string) => {
        const data = await deleteGeoDataWithId(id)
        if (data[1] === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            const dataStatus = await setGeoDataStatus(data[0].id, "merged")
        }
    }
    const handlerGetData = async (geo: any) => {
        let info: any;
        let dataColumn: any;
        let dataTable: any;
        if (selectedPropertiesFromDatabase.length !== undefined) {
            info = selectedPropertiesFromDatabase.filter((i: any) => geo.id === i.column_id)
            dataColumn = await getColumnWithId(info[0].table_id, info[0].column_id)
            dataTable = await fetchTableWithId(info[0].table_id)
        } else {
            info = selectedPropertiesFromDatabase
            dataColumn = await getColumnWithId(info.table_id, info.column_id)
            dataTable = await fetchTableWithId(info.table_id)
        }
        dispatch({ type: 'openLayers/setColumnInfo', payload: dataColumn })
        dispatch({ type: 'openLayers/setTableInfo', payload: dataTable[0] })
        dispatch({ type: 'openLayers/setRendernDataInfo', payload: true })
    }
    const handlerDeleteGeoDataAndColumn = async (geo: any) => {
        console.log(geo)
        const tableId = geo.properties.RawMessage.table_id;
        const userTableIdColumnId = geo.properties.RawMessage.column_id
        const deleteUserTableIdColumn = await removeDataFromUserTablesId(userTableIdColumnId, tableId)
        await handleDeleteGeoData(geo.id)
    }
    const handlerAddNewData = async () => {
        dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: true })
    }
    return (
        <>
            <VStack spacing={".5rem"} overflowX={"hidden"} height={"auto"} width={"100%"}>
                <HStack style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}  backgroundColor={"#90a955ff"} width={"100%"} border={"5px"} borderRadius={"5px"} padding={"5px"}>
                    <Heading size='md'>Dateneinsätze</Heading>
                    <Box>
                        <FiPlusCircle style={{ padding: "5px", margin: "5px"}} size="30" cursor={"pointer"} onClick={() => handlerAddNewData()} />
                    </Box>
                </HStack>
                <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
                {allInfoInProperties?.map((geo: any) => {
                    return (
                        // <Card minWidth={"200px"} width={"100%"} key={`${geo.id}-type`}>
                                <HStack spacing={".5rem"} justifyContent={"space-around"} key={`${geo.id}-dataset-btn`}>
                                    <Button
                                        // disabled={addDrawedInteractionInfo}
                                        backgroundColor={columnInfo?.id === geo.id ? "#ba2d0bff" : "#F7EDE2"}
                                        onClick={() => {
                                            handlerGetData(geo)
                                        }}
                                        cursor={"pointer"}
                                        key={`${geo.id}-geoData-box`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {readableTimestamp(geo.updated_at)}
                                        </Heading>
                                    </Button>
                                    <Box style={{ display: "flex", alignItems: "center" }}>
                                        <MdDeleteForever cursor={"pointer"} onClick={() => handlerDeleteGeoDataAndColumn(geo)} size="25" />
                                        <MdModeEdit cursor={"pointer"} size="25" />
                                    </Box>
                                </HStack>
                    )
                })}
            </VStack>
        </>
    );
}

export default AllInfoForDrawedInTable;