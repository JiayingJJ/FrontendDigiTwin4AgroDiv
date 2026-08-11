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
import { deleteTableWithId, getTablesWithUserId } from '../../api/userTables';
import ModalComponent from '../ModalComponent';
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
    const clickOnSaveBtn = async () => {
        const dataDelete = await deleteTableWithId(selectedTableId);
        const data = await getTablesWithUserId(userInfo)
        const filterData = data.filter((d) => {
            if (!d.deleted_at.Valid) {
                return d;
            }
        });
        dispatch({ type: 'datasetTable/setTables', payload: filterData })
    }
    const clickOnCancelBtn = () => {
    }

    return (
        <>
            <Grid templateColumns={`repeat(7, 1fr)`} gap={3} width={"95vw"} height={"100%"}>
                <GridItem colSpan={2} overflowY={"auto"}>
                    <Grid templateRows={`repeat(15, 1fr)`} height={"90vh"}>
                        <GridItem rowSpan={0.5} paddingBottom={"2px"}>
                            <Heading size='md' width={"100%"} textAlign={"center"} border={"20px"} borderRadius={"20px"} backgroundColor={"lavender"} height={"100%"} alignContent={"center"}>
                                Angelegte Datenbanken
                            </Heading>
                        </GridItem>
                        <GridItem rowSpan={0.5}>
                            <Button
                                width={"100%"}
                                border={"10px"} borderRadius={"10px"}
                                whiteSpace={"wrap"}
                                disabled={addNewDataset} backgroundColor='#ecf39eff' onClick={() => {
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
            <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
            <UserCreateANewTable />
        </>
    );
}

export default Datasets;