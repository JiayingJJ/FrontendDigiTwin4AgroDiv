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
import { addValueInColumns } from "../../../api/dataset";
import SelectComponent from "./SelectComponent";
import { getCurrentTime } from "../../../helpers";
const DatasetColumns = () => {
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)
    const userInfo = useSelector((state: any) => state.user)

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
        console.log(columns)
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
                        <InputComponent name={column.name} hint={column.hint} id={column.id} />
                    </Box>
                );
            default:
                return <div>Unbekannter Feldtyp: {column.type}</div>;
        }
    }
    return (
        <VStack>
            {tableColumns.map((column: any) => renderDataset(column))}
            <Button onClick={() => {
                console.log("submit value in columns")
                addValueInColumns(selectedTableId, getColumnValues())
            }}>Submit</Button>
        </VStack>
    );
}

export default DatasetColumns;