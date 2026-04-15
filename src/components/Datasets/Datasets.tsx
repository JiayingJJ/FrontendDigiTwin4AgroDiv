import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './UserTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';
import CreateColumns from './CreateColumns';
export const getTablesWithUserId = async (userInfo: any) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/usertables/${userInfo.id}`, {
        method: "GET"
    })
    const data = await response.json();
    console.log(data)
    return data;
}
const Datasets = () => {
    const dispatch = useDispatch()
    const createColumnsButton = useSelector((state: any) => state.datasetTable.createColumnsButton)
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)
    const userInfo = useSelector((state: any) => state.user)
    useEffect(() => {
        async function fechtData() {
            const data = await getTablesWithUserId(userInfo)
            dispatch({ type: 'datasetTable/setTables', payload: data })
        }
        fechtData()
    }, [])
    useEffect(() => {
        async function fechtData() {
            const data = await getTablesWithUserId(userInfo)
            dispatch({ type: 'datasetTable/setTables', payload: data })
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