import InputComponent from "./InputComponent";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    Box,
    HStack,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Heading
} from '@chakra-ui/react'
import { addValueInColumns, getColumnWithId, setUserTableColumnDataStatus } from "../../../api/dataset";
import SelectComponent from "./SelectComponent";
import { getCurrentTime } from "../../../helpers";
import { getGeoData, insertGeoData, setGeoDataStatus, updateGeoDataProperties } from "../../../api/geoData";
import FileUploadComponent from "./FileUploadComponent";
const DatasetColumns = () => {
    const dispatch = useDispatch()
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const selectedTable = useSelector((state: any) => state.datasetTable.selectedTable)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)
    const userInfo = useSelector((state: any) => state.user)
    const geometry = useSelector((state: any) => state.openLayers.geometry)
    const geometryType = useSelector((state: any) => state.openLayers.geometryType)
    const addNewColumnsDataInGeometry = useSelector((state: any) => state.openLayers.addNewColumnsDataInGeometry)
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const selectedGeometryDataFromDatabase = useSelector((state: any) => state.openLayers.selectedGeometryDataFromDatabase)
    const selectedPropertiesFromDatabase = useSelector((state: any) => state.openLayers.selectedPropertiesFromDatabase)
    const selectedGeoData = useSelector((state: any) => state.openLayers.selectedGeoData)
    const selectedGeoInfo = useSelector((state: any) => state.openLayers.selectedGeoInfo)
    const colorRedux = useSelector((state: any) => state.openLayers.userSelectedColor)
    const getColumnValues = () => {
        let columns = [];
        userInputColumnValues.map((v: any) => {
            let string = v.name.replace(/[^a-zA-Z0-9]/g, '_');
            columns.push({ name: string, value: v.value })
        })
        const time = getCurrentTime()
        columns.push({ name: "user_id", value: userInfo.id })
        columns.push({ name: "created_at", value: time })
        columns.push({ name: "updated_at", value: time })
        columns.push({ name: "data_status", value: "pending" })
        return columns;
    }
    const renderDataset = (column: any) => {
        console.log(column)
        switch (column.type) {
            case 'radio':
                return (
                    <FormControl key={`${column.id}-radio`}>
                        <FormLabel as='legend'>{column.name}</FormLabel>
                        <RadioGroup defaultValue='Ja'>
                            <HStack spacing='24px'>
                                <Radio value='Ja'>Ja</Radio>
                                <Radio value='Nein'>Nein</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                );
            case 'select':
                return (
                    <SelectComponent key={`${column.id}-select`} name={column.name} hint={column.hint} id={column.id} additionalInfo={column.additional_info} />
                );
            case 'text':
                return (
                    <Box key={column.id}>
                        <InputComponent key={`${column.id}-text`} name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'timestamp':
                return (
                    <Box key={column.id}>
                        <InputComponent key={`${column.id}-timestamp`} name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'real':
                return (
                    <Box key={column.id}>
                        <InputComponent key={`${column.id}-real`} name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'integer':
                return (
                    <Box key={column.id}>
                        <InputComponent key={`${column.id}-integer`} name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'image':
                return (
                    <Box key={column.id}>
                        <FileUploadComponent key={`${column.id}-integer`} name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                )
            default:
                return <div>Unbekannter Feldtyp: {column.type}</div>;
        }
    }
    const handleSubmit = async () => {
        let dataInserGeoData: any;
        const data = await addValueInColumns(selectedTableId, getColumnValues())
        console.log(data)
        if (data[0] === 200) {
            const status = 'merged'
            const dataStatus = await setUserTableColumnDataStatus(data[1][0], selectedTableId, status);
            const dataColumn = await getColumnWithId(selectedTableId, data[1].id);
            const geoData = { "coordinates": geometry, "type": geometryType }
            if (addDrawedInteractionInfo) {
                const geometryInserGeoData = await insertGeoData(userInfo.id, {}, geoData, colorRedux)
                const properties = { "column_id": data[1].id, "table_id": data[1].user_table_id, "id": geometryInserGeoData[0].id }
                dataInserGeoData = await updateGeoDataProperties(geometryInserGeoData[0].id, properties, "pending")
            }
            else {
                const properties = { "column_id": data[1].id, "table_id": data[1].user_table_id, "id": selectedGeoInfo.id }
                dataInserGeoData = await updateGeoDataProperties(selectedGeoInfo.id, properties, "pending")
            }
            dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: false })
            if (dataInserGeoData[1] === 500) {
                console.log("Alert Message")
                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            } else {
                const geoData = await getGeoData();
                const validData = geoData.filter((d: any) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                })
                dispatch({ type: 'openLayers/updateGeoDataAfterChange', payload: { geoData: validData, id: dataInserGeoData[0].id } })
                dispatch({ type: 'openLayers/setGetUpdateFromDatabase', payload: true })
                const dataStatus = await setGeoDataStatus(dataInserGeoData[0].id, "merged")
            }

        }
        dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: false })
        dispatch({ type: 'datasetTable/clearUserInputColumnValues', payload: null })
    }
    const handleCancel = async () => {
        dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
        dispatch({ type: 'datasetTable/clearUserInputColumnValues', payload: null })
    }
    return (
        <Modal closeOnOverlayClick={false} isOpen={addNewColumnsDataInGeometry && userInputColumnValues.length !== 0} onClose={() => handleCancel()} key={`${selectedTable?.id}-render-table-modal`} size={"6xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Heading as='h2' size='xl'>{selectedTable?.table_name}</Heading>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    {tableColumns.map((column: any) => renderDataset(column))}
                </ModalBody>
                <ModalFooter>
                    {tableColumns.length !== 0 &&
                        <Box>
                            <Button backgroundColor={"#F7EDE2"} _hover={{ backgroundColor: "#ba2d0bff" }} onClick={() => handleSubmit()}>Submit</Button>
                            <Button backgroundColor={"#F7EDE2"} _hover={{ backgroundColor: "#ba2d0bff" }} onClick={() => handleCancel()}>Cancel</Button>
                        </Box>}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default DatasetColumns;