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
const DatasetColumns = () => {
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)

    const getColumnValues = () => {
        let columns = [];
        userInputColumnValues.map((v: any) => {
            columns.push({ name: v.name, value: v.value })
        })
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
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Select placeholder='auswählen'>
                            {column.additional_info.options.map((o:string) => {
                                return (<option>{o}</option>)
                            })}
                        </Select>
                    </FormControl>
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