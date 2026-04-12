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
const TableWithColumns = () => {
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const [sortedTableColumns, setSortedTableColumns] = useState<any>();
    useEffect(() => {
        const sortedColumns = [...tableColumns].sort(
  (a, b) => parseInt(a.position) - parseInt(b.position)
);
setSortedTableColumns(sortedColumns)
  console.log(sortedColumns)

    }, [tableColumns])
    const renderFormControl = (column: any) => {
        console.log(column)
        const key = column.name;

        switch (column.type) {
            case 'radio':
                return (
                    <FormControl key={`${column.type}-${column.position}-tooltip`}>
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
                    <FormControl key={`${column.type}-${column.position}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Select placeholder='auswählen'>
                            <option>Winter</option>
                            <option>Frühling</option>
                            <option>Sommer</option>
                            <option>Herbst</option>
                        </Select>
                    </FormControl>
                );
            case 'text':
                return (
                    <FormControl key={`${column.type}-${column.position}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Input placeholder='Name' />
                    </FormControl>
                );
            default:
                return <div key={key}>Unbekannter Feldtyp: {column.type}</div>;
        }
    }
    return (
        <>
            <Box>{sortedTableColumns?.map(column => renderFormControl(column))}</Box>
        </>
    );
}

export default TableWithColumns;