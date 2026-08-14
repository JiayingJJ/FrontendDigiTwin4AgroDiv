import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Grid, GridItem, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { deleteProjectWithId, getProjectWithCreatorId, getProjectWithId } from '../../api/projects';
import { getUserTablesWithProjectId } from '../../api/userTables';

const CreatedProjects = () => {
    const dispatch = useDispatch()
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userInfo = useSelector((state: any) => state.user)
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)
    const editProject = useSelector((state: any) => state.projects.editProject)

    const handlerGetProjectWithId = async (p: any) => {
        const data = await getProjectWithId(p.id)
        dispatch({ type: 'projects/setSelectedProject', payload: data[0] })
        const userTablesData = await getUserTablesWithProjectId(data[0].id)
        dispatch({ type: 'projects/setUserTablesForProject', payload: userTablesData })
    }

    return (
        <Grid templateRows={`repeat(15, 1fr)`} height={"90vh"} width={"100%"}>
            <GridItem rowSpan={0.5} paddingBottom={"2px"}>
                <Heading size='md' width={"100%"} textAlign={"center"} border={"20px"} borderRadius={"20px"} backgroundColor={"lavender"} height={"100%"} alignContent={"center"}>
                    Angelegte Projects</Heading>
            </GridItem>
            <GridItem rowSpan={0.5}>
                <Button width={"100%"} disabled={addNewProject} backgroundColor='#ecf39eff' onClick={() => {
                    console.log("click for add project")
                    dispatch({ type: 'projects/setAddNewProject', payload: true })
                }}>
                    Füge ein neue Projekt hinzu
                </Button>
            </GridItem>

            <GridItem rowSpan={14} overflowY={"auto"}>
                <VStack spacing={".5rem"} overflowX={"hidden"}>
                    {allProjects?.map((p: any) => {
                        return (
                            <Card minWidth={"200px"} width={"100%"}>
                                <CardBody padding={"1rem"}>
                                    <Button
                                        disabled={addNewProject || editProject}
                                        width={"100%"}
                                        border={"10px"} borderRadius={"10px"}
                                        whiteSpace={"wrap"}
                                        backgroundColor={selectedProject !== null && selectedProject.id === p.id ? "#ba2d0bff" : "white"}
                                        onClick={() => {
                                            handlerGetProjectWithId(p)
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