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
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { createProject, getProjectWithCreatorId, setProjectDataStatus } from '../../api/projects';
import { useSelector, useDispatch } from 'react-redux';

const AddProject = () => {
    const dispatch = useDispatch()
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

    const [projectName, setProjectName] = useState<string>("");
    const userInfo = useSelector((state: any) => state.user)

    const handleChange = (e: any) => {
        setProjectName(e.target.value)
    }
    const clickForCreateProject = async (projectName: string, creatorId: string) => {
        const members = [userInfo.id]
        if (isOnLine) {
            const data = await createProject(projectName, creatorId, members)
            console.log(data)
            if (data[1] === 500) {
                console.log("Alert Message")
                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            } else {
                dispatch({ type: 'projects/setAddNewProject', payload: false })
                const dataStatus = await setProjectDataStatus(data[0].id, "merged")
                const projectsWithCreatorId = await getProjectWithCreatorId(userInfo.id)
                if (projectsWithCreatorId[1] !== 200) {

                } else {
                    const notDelete = projectsWithCreatorId[0].filter((d: any) => {
                        if (!d.deleted_at.Valid) {
                            return d;
                        }
                    })
                    dispatch({ type: 'projects/setAllProjects', payload: notDelete })

                }
            }
        }
    }
    return (
        <VStack>
            <FormControl isRequired>
                <FormLabel>Project Name</FormLabel>
                <Input placeholder='Name' onChange={(e) => handleChange(e)} value={projectName} />
            </FormControl>
            <Button width="400px" rightIcon={<MdCancel />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                dispatch({ type: 'projects/setAddNewProject', payload: false })

            }}>
                Abbrechen
            </Button>
            <Button disabled={projectName === ""} width="400px" rightIcon={<FaCheck />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                clickForCreateProject(projectName, userInfo.id)
            }}>
                Create project
            </Button>
        </VStack>
    );
}

export default AddProject;