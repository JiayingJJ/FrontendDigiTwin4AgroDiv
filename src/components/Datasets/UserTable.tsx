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
import { createTable } from '../../api/dataset';
import { MdCancel } from "react-icons/md";
const UserTable = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state: any) => state.user)
    const [tableName, setTableName] = useState<string>("");

    const handleChange = (e: any) => {
        setTableName(e.target.value)
    }

    const clickForCreateTable = async (userInfo: any, tableName: string) => {
        setTableName("")
        const data = await createTable(userInfo, tableName)
        if (data[1] === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            dispatch({ type: 'datasetTable/setUpdatedTables', payload: true })
            dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
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
                    <FormLabel>Tabellenname</FormLabel>
                    <Input placeholder='Name' onChange={(e) => handleChange(e)} value={tableName} />
                </FormControl>
                <Button width="400px" rightIcon={<MdCancel />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                    dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
                    dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
                    dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
                }}>
                    Abbrechen
                </Button>
                <Button disabled={tableName === ""} width="400px" rightIcon={<FaCheck />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                    clickForCreateTable(userInfo, tableName)
                }}>
                    Tabelle erstellen
                </Button>
            </VStack>
        </>
    );
}

export default UserTable;