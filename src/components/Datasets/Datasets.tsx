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
    const [addFormat, setAddFormat] = useState<boolean>(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const userInfo = useSelector((state: any) => state.user)
    const createColumns = useSelector((state: any) => state.datasetTable.createColumns)
    const updatedTables = useSelector((state: any) => state.datasetTable.updatedTables)

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
                setAddFormat(true)
            }}>
                Füge ein neue Datenbankformat hinzu
            </Button>
            {addFormat && <UserTable />}
            <CreatedTables />
            <TableWithColumns />
            {createColumns && <CreateColumns />}
        </>
    );
}

export default Datasets;