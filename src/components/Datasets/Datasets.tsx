import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './UserTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';
import CreateColumns from './CreateColumns';

const Datasets = () => {
    const dispatch = useDispatch()
    const apiUrl = import.meta.env.VITE_API_URL;
    const userInfo = useSelector((state: any) => state.user)
    const createColumnsButton = useSelector((state: any) => state.datasetTable.createColumnsButton)
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)

    const getTablesWithUserId = async () => {
        const response = await fetch(`${apiUrl}/usertables/${userInfo.id}`, {
            method: "GET"
        })
        const data = await response.json();
        console.log(data)
        dispatch({ type: 'datasetTable/setTables', payload: data })
    }
    useEffect(() => {
        getTablesWithUserId()
    }, [])
    useEffect(() => {
        getTablesWithUserId()
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