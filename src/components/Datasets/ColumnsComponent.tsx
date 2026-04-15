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
    Select
} from '@chakra-ui/react'
import SelectComponent from './SelectComponent';
import TextComponent from './TextComponent';
import type { ColumnType } from '../../stores/datasetTableSlice';
type Props = {
    postUserColumns: () => void
}
const ColumnsComponent = ({ postUserColumns }: Props) => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const renderForm = (column: ColumnType, index: number) => {
        switch (column.type) {
            case 'radio':
                return (
                    <FormControl>
                        <FormLabel as='legend'>{column.type}</FormLabel>
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
                    <Box key={column.id} draggable onDrag={() => console.log(index)}>
                        <SelectComponent id={column.id} index={index}/></Box>
                );
            case 'text':
                return (
                    <Box key={column.id} draggable>
                        <TextComponent id={column.id} index={index}/>
                    </Box>
                );
            default:
                return <div >Unbekannter Feldtyp: {column.type}</div>;
        }
    }

    return (
        <>
            <Box>
                {userTableColumns?.map((column: ColumnType, index: number) => renderForm(column, index))}
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => {
                    console.log("Post columns in Backend")
                    postUserColumns()
                }}>Submit</Button>

            </Box>
        </>
    );
}

export default ColumnsComponent;