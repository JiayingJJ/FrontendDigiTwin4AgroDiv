import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button } from '@chakra-ui/react'
import { FiPlusCircle } from "react-icons/fi";
import ColumnsComponent from './ColumnsComponent';
import { v4 as uuidv4 } from 'uuid';
const CreateColumns = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch()
    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableId = useSelector((state: any) => state.datasetTable.selectedTableId)

    const [selectType, setSelectType] = useState<boolean>(false);
    const [userColumns, setUserColumns] = useState<string[]>([]);
    const addColumns = (type: string) => {
        console.log(type)
        setUserColumns(prev => [...prev, type])
        dispatch({ type: 'datasetTable/addUserTableColumns', payload: { id: uuidv4(), name: "", type: type, position: userTableColumns.length } })
        dispatch({ type: 'datasetTable/setUserTableColumnIndex', payload: 1 })

    }

    const postUserColumns = async () => {
        const response = await fetch(`${apiUrl}/usertable/columns`, {
            method: "POST",
            body: JSON.stringify({ "table_id": tableId, "columns": userTableColumns }),
        })
        const data = await response.json();
    }
    return (
        <>
            <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => setSelectType(!selectType)} />
            {/* dispatch({ type: 'datasetTable/setCreateColumns', payload: false}) */}
            {selectType && <Box>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("select")}>Select</Button>
                <Button backgroundColor={"#E8871E"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => addColumns("text")}>Input</Button>
            </Box>}
            {userTableColumns.length !== 0 ? <ColumnsComponent postUserColumns={postUserColumns} /> : null}
        </>
    );
}

export default CreateColumns;