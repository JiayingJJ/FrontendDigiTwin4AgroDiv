import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Grid, GridItem, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack, Divider } from '@chakra-ui/react'
import { deleteProjectWithId, getProjectWithCreatorId, getProjectWithId } from '../../api/projects';
import { getUserTablesWithProjectId } from '../../api/userTables';
import { fetchUserWithId } from '../../api/user';
import { buttonGhostStyle, buttonStyle, titleStyle } from '../Dashboard';

const CreatedProjects = () => {
    const dispatch = useDispatch()
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const ownedProjects = useSelector((state: any) => state.projects.ownedProjects)
    const sharedProjects = useSelector((state: any) => state.projects.sharedProjects)
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userInfo = useSelector((state: any) => state.user)
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)
    const editProject = useSelector((state: any) => state.projects.editProject)

    const handleGetProjectWithId = async (p: any) => {
        dispatch({ type: 'projects/clearMembersForRedux', payload: null })
        const data = await getProjectWithId(p.id)
        dispatch({ type: 'projects/setSelectedProject', payload: data[0] })
        dispatch({ type: 'projects/setSelectedProjectId', payload: data[0].id })
        const userTablesData = await getUserTablesWithProjectId(data[0].id)
        dispatch({ type: 'projects/setUserTablesForProject', payload: userTablesData })
        await getMemberInfo(data[0].members.RawMessage)
    }
    const getMemberInfo = async (ids: []) => {
        ids.forEach(async (i: string) => {
            const data = await fetchUserWithId(i)
            dispatch({ type: 'projects/addMembersForRedux', payload: { id: data[0].id, name: data[0].name, email: data[0].email } })
        });
    }
    return (
        <Grid templateRows={`repeat(15, 1fr)`} height={"90vh"} width={"100%"}>
            <GridItem rowSpan={0.5} paddingBottom={"2px"}>
                <Heading {...titleStyle} size='md' width={"100%"} textAlign={"center"} border={"20px"} borderRadius={"20px"} height={"100%"} alignContent={"center"}>
                    Angelegte Projects</Heading>
            </GridItem>
            <GridItem rowSpan={0.5}>
                <Button {...buttonStyle} width={"100%"} disabled={addNewProject} onClick={() => {
                    dispatch({ type: 'projects/setAddNewProject', payload: true })
                }}>
                    Füge ein neue Projekt hinzu
                </Button>
            </GridItem>

            <GridItem rowSpan={14} overflowY={"auto"}>
                <VStack spacing={".5rem"} overflowX={"hidden"}>
                    <Heading size='md'>Eigenes Projekt</Heading>
                    {ownedProjects?.map((p: any) => {
                        return (
                            <Card minWidth={"200px"} width={"100%"}>
                                <CardBody padding={"1rem"}>
                                    <Button
                                        {...buttonGhostStyle}
                                        disabled={addNewProject || editProject}
                                        width={"100%"}
                                        border={"10px"} borderRadius={"10px"}
                                        whiteSpace={"wrap"}
                                        isActive={selectedProject !== null && selectedProject !== undefined && selectedProject.id === p.id}
                                        onClick={() => {
                                            handleGetProjectWithId(p)
                                        }} cursor={"pointer"}
                                        key={`${p.id}-table-box-project`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {p.name}
                                        </Heading>
                                    </Button>
                                </CardBody>
                            </Card>)
                    })}
                    <Divider />
                    <Heading size='md'>Geteiltes Projekt</Heading>
                    {sharedProjects?.map((p: any) => {
                        return (
                            <Card minWidth={"200px"} width={"100%"}>
                                <CardBody padding={"1rem"}>
                                    <Button
                                        {...buttonGhostStyle}
                                        disabled={addNewProject || editProject}
                                        width={"100%"}
                                        border={"10px"} borderRadius={"10px"}
                                        whiteSpace={"wrap"}
                                        isActive={selectedProject !== null && selectedProject !== undefined && selectedProject.id === p.id}
                                        onClick={() => {
                                            handleGetProjectWithId(p)
                                        }} cursor={"pointer"}
                                        key={`${p.id}-table-box-project`}>
                                        <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                            {p.name}
                                        </Heading>
                                    </Button>
                                </CardBody>
                            </Card>)
                    })}
                </VStack>
            </GridItem>
        </Grid>
    );
}

export default CreatedProjects;