import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GridItem, Button, HStack, VStack, Grid } from '@chakra-ui/react'
import ColumnsComponent from './ColumnsComponent';
import { v4 as uuidv4 } from 'uuid';
import { patchColumns, postColumns, putNewColumns, removeColumns } from '../../api/dataset';
import { fetchTableWithId } from '../../api/userTables';
import { databaseSqlite } from '../sqlite/db';
const CreateColumns = () => {
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)
    const editTable = useSelector((state: any) => state.datasetTable.editTable)
    const modalResult = useSelector((state: any) => state.modalInfo.modalResult)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)
    const editedColumns = useSelector((state: any) => state.datasetTable.editedColumns)
    const removedColumns = useSelector((state: any) => state.datasetTable.removedColumns)
    const hasChanged = useSelector((state: any) => state.datasetTable.hasChanged)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const addColumns = (type: string) => {
        const newId = uuidv4()
        dispatch({ type: 'datasetTable/addUserTableColumns', payload: { id: newId, name: "", type: type, position: userTableColumns.length } })
        dispatch({ type: 'datasetTable/setUserTableColumnIndex', payload: 1 })
        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: newId })
    }
    const handlePostColumns = async () => {
        if (isOnLine) {
            const postData = await postColumns(tableId, userTableColumns)
            if (tableColumns.length !== 0 && newColumns.length !== 0) {
                const putData = await putNewColumns(tableId, newColumns)
            }
            if (tableColumns.length !== 0 && editedColumns.length !== 0) {
                const getOldInfo = tableColumns.filter((tc: any) => editedColumns.some((e: any) => tc.id === e.id))
                const result = editedColumns.map((editedC: any) => {
                    const newInfo = getOldInfo.find((old: any) => old.id === editedC.id);
                    return {
                        id: editedC.id,
                        old_name: newInfo?.name,
                        new_name: editedC.name ?? null
                    };
                });
                const patchData = await patchColumns(tableId, result)
            }

            if (tableColumns.length !== 0 && removedColumns.length !== 0) {
                const result = await removeColumns(tableId, removedColumns)
            }
            dispatch({ type: 'datasetTable/setEditTable', payload: false })
            dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
            const data = await fetchTableWithId(tableId)
            if (data[1] !== 500) {
                dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].columns_in_table.RawMessage })
                dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
            }
        } else {
            await databaseSqlite.initDb()
            await databaseSqlite.updateUserTableColumns(tableId, userTableColumns)
        }
    }
    return (
        <Grid templateRows={`repeat(8, 1fr)`} height={"90vh"}>
            <GridItem rowSpan={7} overflowY={"auto"} overflowX={"hidden"}>
                {((addingColumns && !editTable && userTableColumns.length !== 0) || (!addingColumns && editTable && userTableColumns.length !== 0)) ? <ColumnsComponent /> : null}
            </GridItem>
            <GridItem rowSpan={1}>

                {(addingColumns || editTable) && <VStack paddingTop={"15px"}>
                    <HStack>
                        <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("select")}>Add a Select column</Button>
                        <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("text")}>Add an Input column</Button>
                        <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("file")}>Add an File or Picture column</Button>
                    </HStack>
                    <HStack>
                        <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} disabled={!hasChanged} onClick={() => handlePostColumns()}>Submit</Button>
                        <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => {
                            if (userTableColumns.length !== 0) {
                                dispatch({ type: 'modalInfo/setShowModal', payload: true })
                                dispatch({ type: 'modalInfo/setModalHeader', payload: "Nicht gespeicherte Informationen" })
                                dispatch({ type: 'modalInfo/setModalBody', payload: "Wollen Sie die Änderung verwerfen?" })
                                dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
                                dispatch({ type: 'modalInfo/setModalType', payload: "createColumns" })
                            } else {
                                dispatch({ type: 'datasetTable/setAddingColumns', payload: false })
                                dispatch({ type: 'datasetTable/setEditTable', payload: false })
                            }
                        }}>Cancel</Button>
                    </HStack>
                </VStack>}
            </GridItem>
        </Grid>
    );
}

export default CreateColumns;