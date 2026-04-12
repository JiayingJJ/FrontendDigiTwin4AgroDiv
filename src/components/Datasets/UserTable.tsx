import React, { useState } from 'react';
import {
    Button,
    Box,
    HStack,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    RadioGroup,
    Radio,
    Select
} from '@chakra-ui/react'
import { FaCheck } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';

const UserTable = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch()
    const userInfo = useSelector((state: any) => state.user)
    const [tableName, setTableName] = useState<string>("");

    const handleChange = (e: any) => {
        setTableName(e.target.value)
    }

    const createTable = async () => {
        setTableName("")
        const response = await fetch(`${apiUrl}/usertable`, {
            method: "POST",
            body: JSON.stringify({ user_id: userInfo.id, name: tableName }),
        })
        const data = await response.json();
        console.log(data)
        if (response.status === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: data.error })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            dispatch({ type: 'datasetTable/setId', payload: data.ID })
            dispatch({ type: 'datasetTable/setName', payload: data.Name })
            dispatch({ type: 'datasetTable/setUserId', payload: data.UserID })
        }
    }
    return (
        <>
            <VStack>
                <FormControl>
                    <FormLabel>User Name</FormLabel>
                    <Input placeholder='Name' defaultValue={userInfo.name} />
                </FormControl>

                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' defaultValue={userInfo.email} />
                    <FormHelperText>Prüfen, ob Email Address korrekt ist</FormHelperText>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Tabelle Name</FormLabel>
                    <Input placeholder='Name' onChange={(e) => handleChange(e)} value={tableName} />
                </FormControl>

                <Button disabled={tableName === ""} width="400px" rightIcon={<FaCheck />} backgroundColor={"#E8871E"} color="white" onClick={() => createTable()}>
                    Tabelle erstellen
                </Button>
            </VStack>
        </>
    );
}

export default UserTable;