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
import { fetchTableWithId, patchColumns, postColumns, putNewColumns, removeColumns } from '../../api/dataset';
type Props = {
}
const ColumnsComponent = ({ }: Props) => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)
    const editedColumns = useSelector((state: any) => state.datasetTable.editedColumns)
    const removedColumns = useSelector((state: any) => state.datasetTable.removedColumns)
    const hasChanged = useSelector((state: any) => state.datasetTable.hasChanged)


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
    const handlePostColumns = async () => {
        console.log("Post columns in Backend")

        const postData = await postColumns(tableId, userTableColumns)
        if (tableColumns.length !== 0 && newColumns.length !== 0) {
            console.log(newColumns)

            const putData = await putNewColumns(tableId, newColumns)
            console.log(putData)
        }
        if (tableColumns.length !== 0 && editedColumns.length !== 0) {
            console.log("patch")
            const getOldInfo = tableColumns.filter((tc: any) => editedColumns.some((e: any) => tc.id === e.id))
            console.log(editedColumns)
            console.log(getOldInfo)
            const result = editedColumns.map((editedC: any) => {
                const newInfo = getOldInfo.find((old: any) => old.id === editedC.id);
                return {
                    id: editedC.id,
                    old_name: newInfo?.name,
                    new_name: editedC.name ?? null
                };
            });

            console.log(result);
            const patchData = await patchColumns(tableId, result)
            console.log(patchData)
        }

        if (tableColumns.length !== 0 && removedColumns.length !== 0) {
            const result = await removeColumns(tableId, removedColumns)
            console.log(result)
        }
        console.log(postData)
        dispatch({ type: 'datasetTable/setEditTable', payload: false })

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
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} disabled={!hasChanged} onClick={() => handlePostColumns()}>Submit</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => dispatch({ type: 'datasetTable/setEditTable', payload: false })}>Cancel</Button>

            </Box>
        </>
    );
}

export default ColumnsComponent;