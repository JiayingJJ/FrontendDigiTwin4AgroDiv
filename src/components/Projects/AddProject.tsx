import React, { useState } from 'react';
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { MdCancel } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { createProject, getProjectWithCreatorId, setProjectDataStatus } from '../../api/projects';
import { useSelector, useDispatch } from 'react-redux';

const AddProject = () => {
    const dispatch = useDispatch()
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)

    const [projectName, setProjectName] = useState<string>("");
    const [projectDesc, setProjectDesc] = useState('')
    const userInfo = useSelector((state: any) => state.user)

    const handleChange = (e: any) => {
        setProjectName(e.target.value)
    }
    const clickForCreateProject = async (projectName: string, creatorId: string, projectDescription: string) => {
        if (isOnLine) {
            const data = await createProject(projectName, creatorId, [], projectDescription)
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
        setProjectName("")
        setProjectDesc("")
    }
    let handleProjectDescriptionChange = (e) => {
        let inputValue = e.target.value
        setProjectDesc(inputValue)
    }
    return (
        <Modal closeOnOverlayClick={false}
            isOpen={addNewProject}
            onClose={() =>
                dispatch({ type: 'projects/setAddNewProject', payload: false })
            }
            key={"user-create-new-table"}
            size={"5xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add new project</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl isRequired>
                        <FormLabel>Project Name</FormLabel>
                        <Input placeholder='Name' onChange={(e) => handleChange(e)} value={projectName} />
                    </FormControl>
                    <FormControl >
                        <FormLabel>Project describtion</FormLabel>
                        <Textarea
                            value={projectDesc}
                            onChange={handleProjectDescriptionChange}
                            placeholder='Geben Sie eine Beschreibung über das Projekt'
                            size='sm'
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button width="400px" rightIcon={<MdCancel />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                        dispatch({ type: 'projects/setAddNewProject', payload: false })
                    }}>
                        Abbrechen
                    </Button>
                    <Button disabled={projectName === ""} width="400px" rightIcon={<FaCheck />} backgroundColor={"#E8871E"} color="white" onClick={() => {
                        clickForCreateProject(projectName, userInfo.id, projectDesc)
                    }}>
                        Create project
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddProject;