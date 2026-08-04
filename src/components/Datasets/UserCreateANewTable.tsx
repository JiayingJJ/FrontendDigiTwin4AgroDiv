import React, { useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Select,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid';
import { FaCheck } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { MdCancel } from "react-icons/md";
import { databaseSqlite } from '../sqlite/db';
import { getCurrentTime } from '../../helpers';
import type { UserTable } from '../sqlite/types';
import { createTable, setUserTableDataStatus } from '../../api/userTables';
const UserCreateANewTable = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state: any) => state.user)
    const [tableName, setTableName] = useState<string>("");
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const projectId = useSelector((state: any) => state.datasetTable.projectId)
    const addNewDataset = useSelector((state: any) => state.datasetTable.addNewDataset)

    const handleChange = (e: any) => {
        setTableName(e.target.value)
    }

    const clickForCreateTable = async (userInfo: any, tableName: string) => {

        setTableName("")
        if (isOnLine) {
            const data = await createTable(userInfo, tableName, projectId)
            if (data[1] === 500) {
                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            } else {
                dispatch({ type: 'datasetTable/setUpdatedTables', payload: true })
                dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
                const dataStatus = await setUserTableDataStatus(data[0].id, "merged")
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
            await databaseSqlite.initDb()
            await databaseSqlite.insertUserTables(data)
        }

    }
    const handleSelectProject = (e: any) => {
        dispatch({ type: 'datasetTable/setProjectId', payload: e.target.value })
    }
    return (
        <Modal closeOnOverlayClick={false}
            isOpen={addNewDataset}
            onClose={() =>
                dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
            }
            // key={`${selectedTable?.id}-render-table-modal`}
            size={"5xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add new Dataset</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
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
                    <FormControl>
                        <FormLabel>Project</FormLabel>
                        <Select placeholder='Select project' onChange={handleSelectProject}>
                            {allProjects.map((p: any) => {
                                return (
                                    <option value={p.id}>{p.name}</option>
                                )
                            })}
                        </Select>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button marginRight="5px" rightIcon={<MdCancel />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                        dispatch({ type: 'datasetTable/setCreateColumnsButton', payload: false })
                        dispatch({ type: 'datasetTable/setAddNewDataset', payload: false })
                        dispatch({ type: 'datasetTable/clearInfoFromADatabase', payload: null })
                    }}>
                        Abbrechen
                    </Button>
                    <Button disabled={tableName === ""} rightIcon={<FaCheck />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                        clickForCreateTable(userInfo, tableName)
                    }}>
                        Tabelle erstellen
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default UserCreateANewTable;