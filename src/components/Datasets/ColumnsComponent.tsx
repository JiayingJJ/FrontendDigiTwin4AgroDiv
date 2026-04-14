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
    console.log(userTableColumns)
    const renderForm = (column: ColumnType) => {
        switch (column.type) {
            case 'radio':
                return (
                    <FormControl >
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
                    <Box key={column.id}>
                        <SelectComponent index={column.id} /></Box>
                );
            case 'text':
                return (
                    <Box key={column.id}>
                        <TextComponent index={column.id} />
                    </Box>
                );
            default:
                return <div >Unbekannter Feldtyp: {column.type}</div>;
        }
    }

    return (
        <>
            <Box>
                {userTableColumns?.map((column: ColumnType) => renderForm(column))}
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => {
                    console.log("Post columns in Backend")
                    postUserColumns()
                }}>Submit</Button>

            </Box>
        </>
    );
}

export default ColumnsComponent;