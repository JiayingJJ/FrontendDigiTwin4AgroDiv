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
import { v4 as uuidv4 } from 'uuid';
import { FaCheck } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { createTable } from '../../api/dataset';
import { MdCancel } from "react-icons/md";
import { databaseSqlite } from '../sqlite/db';
import { getCurrentTime } from '../../helpers';
import type { UserTable } from '../sqlite/worker';
const UserTable = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state: any) => state.user)
    const [tableName, setTableName] = useState<string>("");
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

    const handleChange = (e: any) => {
        setTableName(e.target.value)
    }

    const clickForCreateTable = async (userInfo: any, tableName: string) => {

        setTableName("")
        if (isOnLine) {
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
        } else {
            const newId = uuidv4()
            const time = getCurrentTime()
            const data: UserTable = {
                ID: newId,
                UserID: userInfo.id,
                TableName: tableName,
                ColumnsInTable: "",
                CreatedAt: time,
                UpdatedAt: time,
                DeletedAt: "",
                DataStatus: "pending",
            }
            console.log(data)
            await databaseSqlite.initDb()
            await databaseSqlite.insertUserTables(data)
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