import React, { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    GridItem,
    Heading,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserCreateANewTable from './UserCreateANewTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';
import { databaseSqlite } from '../sqlite/db';
import { isZeroTimeString } from '../../helpers';
import { getCreatedAndSharedInfo } from '../sqlite/helper';
import { buttonStyle, titleStyle } from '../Dashboard';
const Datasets = () => {
    const dispatch = useDispatch()
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)
    const userInfo = useSelector((state: any) => state.user)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    useEffect(() => {
        async function fechtData() {
            if (isOnLine) {
                const data = await getCreatedAndSharedInfo(userInfo.id)
                const selected = data.allUserTables.filter((i: any) => i.id === selectedTableId)
                dispatch({ type: 'datasetTable/setSelectedTable', payload: selected[0] })
                dispatch({ type: 'datasetTable/setTables', payload: data.allUserTables })
            } else {
                await databaseSqlite.initDb();
                const data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
                const filterData = data?.filter((d: any) => {
                    const notDelete = isZeroTimeString(d.deleted_at)
                    if (notDelete) {
                        return d;
                    }
                })
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
            }
        }
        fechtData()
        dispatch({ type: 'datasetTable/setUpdatedTables', payload: false })
    }, [updatedTables])

    return (
        <>
            <Grid templateColumns={`repeat(7, 1fr)`} gap={3} width={"95vw"} height={"100%"}>
                <GridItem colSpan={2} overflowY={"auto"}>
                    <Grid templateRows={`repeat(15, 1fr)`} height={"90vh"}>
                        <GridItem rowSpan={0.5} paddingBottom={"2px"}>
                            <Heading {...titleStyle} size='md' width={"100%"} textAlign={"center"} border={"20px"} borderRadius={"20px"} height={"100%"} alignContent={"center"}>
                                Angelegte Datenbanken
                            </Heading>
                        </GridItem>
                        <GridItem rowSpan={0.5}>
                            <Button
                                width={"100%"}
                                border={"10px"} borderRadius={"10px"}
                                whiteSpace={"wrap"}
                                disabled={addNewDataset} {...buttonStyle} onClick={() => {
                                    dispatch({ type: 'datasetTable/setAddNewDataset', payload: true })
                                    dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
                                }}>
                                Füge ein neue Datenbankformat hinzu
                            </Button>
                        </GridItem>
                        <GridItem rowSpan={14} overflowY={"auto"}>
                            <CreatedTables />
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem colSpan={5} h='100%'>
                    <TableWithColumns />
                </GridItem>
            </Grid>
            <UserCreateANewTable />
        </>
    );
}

export default Datasets;