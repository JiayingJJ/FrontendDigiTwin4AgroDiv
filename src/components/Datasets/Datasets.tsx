import React, { useEffect, useState } from 'react';
import {
    Button,
    Grid,
    GridItem,
    VStack,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserCreateANewTable from './UserCreateANewTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';
import CreateColumns from './CreateColumns';
import { databaseSqlite } from '../sqlite/db';
import { isZeroTimeString } from '../../helpers';
import { getTablesWithUserId } from '../../api/userTables';
const Datasets = () => {
    const dispatch = useDispatch()
    const createColumnsButton = useSelector((state: any) => state.datasetTable.createColumnsButton)
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)
    const userInfo = useSelector((state: any) => state.user)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

    useEffect(() => {
        async function fechtData() {
            if (isOnLine) {
                const data = await getTablesWithUserId(userInfo)
                const filterData = data.filter((d: any) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                });
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
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
    }, [])
    useEffect(() => {
        async function fechtData() {
            if (isOnLine) {
                const data = await getTablesWithUserId(userInfo)
                const filterData = data.filter((d: any) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                });
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
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
            <Grid templateColumns={`repeat(6, 1fr)`} gap={6} width={"90vw"} height={"100%"} padding={"0 0 2vh 0"}>
                <GridItem h='100%' w="100%">
                    <VStack spacing={".5rem"} overflowX={"hidden"} width={"100%"}>
                        <CreatedTables />
                        <Button disabled={addNewDataset} backgroundColor='#ecf39eff' onClick={() => {
                            dispatch({ type: 'datasetTable/setAddNewDataset', payload: true })
                            dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
                        }}>
                            Füge ein neue Datenbankformat hinzu
                        </Button>
                        {addNewDataset && <UserCreateANewTable />}
                    </VStack>
                </GridItem>
                <GridItem colSpan={5} h='100%'>
                    <TableWithColumns />
                    {createColumnsButton && <CreateColumns />}
                </GridItem>
            </Grid>
        </>
    );
}

export default Datasets;