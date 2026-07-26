import InputComponent from "./InputComponent";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    Box,
    HStack,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    RadioGroup,
    Radio,
    Select,
    Text
} from '@chakra-ui/react'
import { addValueInColumns, getColumnWithId, setUserTableColumnDataStatus } from "../../../api/dataset";
import SelectComponent from "./SelectComponent";
import { getCurrentTime } from "../../../helpers";
import { getGeoData, insertGeoData, setGeoDataStatus, updateGeoDataProperties } from "../../../api/geoData";
const DatasetColumns = () => {
    const dispatch = useDispatch()
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)
    const userInfo = useSelector((state: any) => state.user)
    const geometry = useSelector((state: any) => state.openLayers.geometry)
    const geometryType = useSelector((state: any) => state.openLayers.geometryType)
    const addNewColumnsDataInGeometry = useSelector((state: any) => state.openLayers.addNewColumnsDataInGeometry)
    const selectedGeometryDataFromDatabase = useSelector((state: any) => state.openLayers.selectedGeometryDataFromDatabase)
    const selectedPropertiesFromDatabase = useSelector((state: any) => state.openLayers.selectedPropertiesFromDatabase)
    const selectedGeoData = useSelector((state: any) => state.openLayers.selectedGeoData)
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
                    <FormControl key={`${column.id}-tooltip`}>
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
                    <SelectComponent name={column.name} hint={column.hint} id={column.id} additionalInfo={column.additional_info} />
                );
            case 'text':
                return (
                    <Box key={column.id}>
                        <InputComponent name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'timestamp':
                return (
                    <Box key={column.id} draggable>
                        <InputComponent name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'real':
                return (
                    <Box key={column.id} draggable>
                        <InputComponent name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
            case 'integer':
                return (
                    <Box key={column.id} draggable>
                        <InputComponent name={column.name} hint={column.hint} id={column.id} type={column.type} />
                    </Box>
                );
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
            const properties = { "column_id": data[1].id, "table_id": selectedTableId }
            if (!addNewColumnsDataInGeometry) {
                dataInserGeoData = await insertGeoData(userInfo.id, properties, geoData, colorRedux)
            } else {
                const dataStatus = await setUserTableColumnDataStatus(data[1][0], selectedTableId, status);
                const dataColumn = await getColumnWithId(selectedTableId, data[1].id);
                const properties = { "column_id": data[1].id, "table_id": selectedTableId, "id": selectedGeoData.id }
                dataInserGeoData = await updateGeoDataProperties(selectedGeoData.id, properties, "pending")
            }
            dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: false })
            if (dataInserGeoData[1] === 500) {
                console.log("Alert Message")
                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            } else {
                const dataStatus = await setGeoDataStatus(dataInserGeoData[0].id, "merged")
            }

        }
        dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: false })
    }
    const handleCancel = async () => {
        dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
    }
    return (
        <VStack>
            {tableColumns.map((column: any) => renderDataset(column))}
            {tableColumns.length !== 0 &&
                <Box>
                    <Button onClick={() => handleSubmit()}>Submit</Button>
                    <Button onClick={() => handleCancel()}>Cancel</Button>
                </Box>}
        </VStack>
    );
}

export default DatasetColumns;