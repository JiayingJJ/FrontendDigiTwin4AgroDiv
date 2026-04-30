import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './UserTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';
import CreateColumns from './CreateColumns';
import { getTablesWithUserId } from '../../api/dataset';
const Datasets = () => {
    const dispatch = useDispatch()
    const createColumnsButton = useSelector((state: any) => state.datasetTable.createColumnsButton)
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)
    const userInfo = useSelector((state: any) => state.user)
    useEffect(() => {
        async function fechtData() {
            const data = await getTablesWithUserId(userInfo)
            const filterData = data.filter((d: any) => {
                if (!d.DeletedAt.Valid) {
                    return d;
                }
            });
            dispatch({ type: 'datasetTable/setTables', payload: filterData })
        }
        fechtData()
    }, [])
    useEffect(() => {
        async function fechtData() {
            const data = await getTablesWithUserId(userInfo)
            const filterData = data.filter((d: any) => {
                if (!d.DeletedAt.Valid) {
                    return d;
                }
            });
            dispatch({ type: 'datasetTable/setTables', payload: filterData })
        }
        fechtData()
        dispatch({ type: 'datasetTable/setUpdatedTables', payload: false })
    }, [updatedTables])
    return (
        <>
            <Button backgroundColor='#EDB458' onClick={() => {
                dispatch({ type: 'datasetTable/setAddNewDataset', payload: true })
                dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
            }}>
                Füge ein neue Datenbankformat hinzu
            </Button>
            {addNewDataset && <UserTable />}
            <CreatedTables />
            <TableWithColumns />
            {createColumnsButton && <CreateColumns />}
        </>
    );
}

export default Datasets;