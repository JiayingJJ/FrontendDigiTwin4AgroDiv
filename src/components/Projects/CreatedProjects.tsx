import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { MdDeleteForever } from "react-icons/md";
import ModalComponent from '../ModalComponent';
import { deleteProjectWithId, getProjectWithCreatorId, getProjectWithId } from '../../api/projects';
import { getUserTablesWithProjectId } from '../../api/userTables';

const CreatedProjects = () => {
    const dispatch = useDispatch()
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userInfo = useSelector((state: any) => state.user)

    const clickOnSaveBtn = async () => {
        const dataDelete = await deleteProjectWithId(selectedProject.id);
        console.log(dataDelete)
    }
    const clickOnCancelBtn = () => {
    }

    const handlerGetProjectWithId = async (p: any) => {
        const data = await getProjectWithId(p.id)
        dispatch({ type: 'projects/setSelectedProject', payload: data[0] })
        const userTablesData = await getUserTablesWithProjectId(data[0].id)
        dispatch({ type: 'projects/setUserTablesForProject', payload: userTablesData })
    }
    const handleDeleteProject = async (p: any) => {
        const data = await deleteProjectWithId(p.id)
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
        console.log(data)
    }
    return (
        <>
            <Card width={"100%"} textAlign={"center"}>
                <CardHeader backgroundColor={"#90a955ff"}>
                    <Heading size='md'>Angelegte Projects</Heading>
                </CardHeader>
                <ModalComponent clickOnSaveBtn={clickOnSaveBtn} clickOnCancelBtn={clickOnCancelBtn} />
            </Card>

            <VStack spacing={".5rem"} overflowX={"hidden"} height={"100%"} width={"100%"}>
                {allProjects?.map((p: any) => {
                    return (
                        <Card minWidth={"200px"} width={"100%"}>
                            <CardBody padding={"1rem"}>
                                <HStack spacing={".5rem"} justifyContent={"space-between"}>
                                    <Button
                                        // disabled={addingColumns}
                                        // backgroundColor={selectedTableId === t.id ? "red" : "white"}
                                        backgroundColor={selectedProject.id === p.id ? "#ba2d0bff" : "white"}
                                        onClick={() => {
                                            handlerGetProjectWithId(p)
                                        }} cursor={"pointer"}
                                        key={`${p.id}-table-box`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {p.name}
                                        </Heading>
                                    </Button>
                                    <Box style={{ display: "flex", alignItems: "center" }}>
                                        <MdDeleteForever cursor={"pointer"} onClick={() => handleDeleteProject(p)} size="25" />
                                    </Box>
                                </HStack>
                            </CardBody>
                        </Card>)
                })}
            </VStack>
        </>
    );
}

export default CreatedProjects;