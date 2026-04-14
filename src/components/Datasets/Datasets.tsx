import React, { useEffect, useState } from 'react';
import {
    Button,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './UserTable';
import TableWithColumns from './TableWithColumns';
import CreatedTables from './CreatedTables';

const Datasets = () => {
    const dispatch = useDispatch()
    const [addFormat, setAddFormat] = useState<boolean>(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const userInfo = useSelector((state: any) => state.user)
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
        </>
    );
}

export default Datasets;