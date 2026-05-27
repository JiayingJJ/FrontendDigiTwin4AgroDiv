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
import { fetchTableWithId, postColumns, putNewColumns } from '../../api/dataset';
type Props = {
}
const ColumnsComponent = ({ }: Props) => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)

    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const checkColumns = () => {

        console.log(userTableColumns)
        console.log(tableColumns)
        if (userTableColumns.length === tableColumns.length) {
            console.log("ändern")
            
        } else {
            console.log("hinzufügen oder delete")
            const diffForDeleteColumn = tableColumns.filter(
                (tc: any) => !userTableColumns.some((utc: any) => utc.id === tc.id)
            );
            // 
            const diffForAddColumn = userTableColumns.filter(
                (utc: any) => !tableColumns.some((tc: any) => utc.id === tc.id)
            );
            console.log("Unterschied diffForDeleteColumn: ", diffForDeleteColumn)
            console.log("Unterschied diffForAddColumn: ", diffForAddColumn)
            dispatch({ type: 'datasetTable/setNewColumns', payload: diffForAddColumn })
        }
    }

    useEffect(() => {
        checkColumns()
    }, [userTableColumns])
    const handlePostColumns = async () => {
        console.log("Post columns in Backend")

        const postData = await postColumns(tableId, userTableColumns)
        if (tableColumns.length !== 0) {
            console.log(newColumns)
            const putData = await putNewColumns(tableId, newColumns)
            console.log(putData)
        }

        console.log(postData)

        dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
        const data = await fetchTableWithId(tableId)
        console.log(data)
        if (data[1] !== 500) {
            dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].ColumnsInTable.RawMessage })
            dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
        }
    }
    const renderForm = (column: ColumnType, index: number) => {
        const data = userTableColumns.filter((m) =>
            m.id === column.id
        )
        console.log(data[0])
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
            default:
                return <div >Unbekannter Feldtyp: {column.type}</div>;
        }
    }

    return (
        <>
            <Box>
                {userTableColumns?.map((column: ColumnType, index: number) => renderForm(column, index))}
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => handlePostColumns()}>Submit</Button>
            </Box>
        </>
    );
}

export default ColumnsComponent;