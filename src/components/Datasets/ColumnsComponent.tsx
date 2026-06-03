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
    Divider
} from '@chakra-ui/react'
import SelectComponent from './SelectComponent';
import TextComponent from './TextComponent';
import type { ColumnType } from '../../stores/datasetTableSlice';
import { fetchTableWithId, patchColumns, postColumns, putNewColumns, removeColumns } from '../../api/dataset';
type Props = {
}
const ColumnsComponent = ({ }: Props) => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)

    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const checkColumns = () => {
        console.log(userTableColumns)
        console.log(tableColumns)
        console.log("hinzufügen oder delete")
        if (tableColumns.length < userTableColumns.length) {
            // Add column
            const diffForAddColumn = userTableColumns.filter(
                (utc: any) => !tableColumns.some((tc: any) => utc.id === tc.id)
            );
            console.log("Unterschied diffForAddColumn: ", diffForAddColumn)
            dispatch({ type: 'datasetTable/setNewColumns', payload: diffForAddColumn })
        } else {
            // Delete column
            const diffForDeleteColumn = tableColumns.filter(
                (tc: any) => !userTableColumns.some((utc: any) => utc.id === tc.id)
            );

            console.log("Unterschied diffForDeleteColumn: ", diffForDeleteColumn)
            dispatch({ type: 'datasetTable/setRemovedColumns', payload: diffForDeleteColumn })
        }
        // Edit Column
        const diffWithName = userTableColumns.filter(
            (utc: any) => tableColumns.some((tc: any) => tc['id'] === utc['id'] && tc['name'] !== utc['name'])
        );
        console.log("Unterschied diffWithName: ", diffWithName)
        dispatch({ type: 'datasetTable/setEditedColumns', payload: diffWithName })
    }

    useEffect(() => {
        checkColumns()
    }, [userTableColumns])

    const renderForm = (column: ColumnType, index: number) => {
        const data = userTableColumns.filter((m) =>
            m.id === column.id
        )
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
                        <SelectComponent id={column.id} index={index} data={data[0]} /></Box>
                );
            case 'text':
                return (
                    <Box key={column.id} draggable>
                        <TextComponent id={column.id} index={index} data={data[0]} />
                    </Box>
                );
            case 'timestamp':
                return (
                    <Box key={column.id} draggable>
                        <TextComponent id={column.id} index={index} data={data[0]} />
                    </Box>
                );
            case 'real':
                return (
                    <Box key={column.id} draggable>
                        <TextComponent id={column.id} index={index} data={data[0]} />
                    </Box>
                );
            case 'integer':
                return (
                    <Box key={column.id} draggable>
                        <TextComponent id={column.id} index={index} data={data[0]} />
                    </Box>
                );
            default:
                return <div >Unbekannter Feldtyp: {column.type}</div>;
        }
    }

    return (
        <>
            <Box>
                {userTableColumns?.map((column: ColumnType, index: number) => {
                    return (
                        <VStack alignItems={"left"}>
                            {index !== 0 && <Divider orientation='horizontal' borderColor={"red"} borderRadius={10} borderWidth={2} />}
                            {renderForm(column, index)}
                        </VStack>
                    )
                })}
            </Box>
        </>
    );
}

export default ColumnsComponent;