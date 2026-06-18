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
const AllInfoForDrawedInTable = () => {

    const dispatch = useDispatch()
    const geoDataWithSameGeometry = useSelector((state: any) => state.openLayers.geoDataWithSameGeometry)

    const clickOnSaveBtn = async () => {

    }
    const clickOnCancelBtn = () => {
    }
    const readable = (ts: string) => {
        return new Date(ts).toLocaleString("de-DE", {
            timeZone: "Europe/Berlin",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
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
            const dataStatus = await setGeoDataStatus(data[0].ID, "merged")
        }
    }
    const handlerGetData = async (geo: any) => {
        console.log(geo)
        const tableId = geo.properties.RawMessage.table_id;
        const userTableIdColumnId = geo.properties.RawMessage.column_id
        const dataColumn = await getColumnWithId(tableId, userTableIdColumnId)
        const dataTable = await fetchTableWithId(tableId)
        dispatch({ type: 'openLayers/setSelectedGeoData', payload: geo })
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
        dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: true })
    }
    return (
        <>
            <VStack spacing={".5rem"} overflowX={"hidden"} height={"100%"} width={"100%"}>
                <HStack spacing={".5rem"} style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
                    <Heading size='md'>Dateneinsätze</Heading>
                    <Box>
                        <FiPlusCircle style={{ padding: "5px", margin: "5px", zIndex: "1000" }} size="30" cursor={"pointer"} onClick={() => handlerAddNewData()} />
                    </Box>
                </HStack>
                <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
                {geoDataWithSameGeometry?.map((geo: any) => {
                    return (
                        <Card minWidth={"200px"} width={"100%"}>
                            <CardBody padding={".5rem"}>
                                <HStack spacing={".5rem"} justifyContent={"space-around"}>
                                    <Button
                                        // disabled={addingColumns}
                                        // backgroundColor={selectedTableId === t.id ? "red" : "white"}
                                        onClick={() => {
                                            handlerGetData(geo)
                                        }}
                                        cursor={"pointer"}
                                        key={`${geo.id}-geoData-box`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {readable(geo.updated_at)}
                                        </Heading>
                                    </Button>
                                    <Box style={{ display: "flex", alignItems: "center" }}>
                                        <MdDeleteForever cursor={"pointer"} onClick={() => handlerDeleteGeoDataAndColumn(geo)} size="25" />
                                        <MdModeEdit cursor={"pointer"} size="25" />
                                    </Box>
                                </HStack>
                            </CardBody>
                        </Card>
                    )
                })}
            </VStack>
        </>
    );
}

export default AllInfoForDrawedInTable;