import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Box, Text, Button, HStack, VStack } from '@chakra-ui/react'
import { deleteProjectWithId, getProjectWithCreatorId, getProjectWithId } from '../../api/projects';
import { getUserTablesWithProjectId } from '../../api/userTables';

const CreatedProjects = () => {
    const dispatch = useDispatch()
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userInfo = useSelector((state: any) => state.user)

    const handlerGetProjectWithId = async (p: any) => {
        const data = await getProjectWithId(p.id)
        dispatch({ type: 'projects/setSelectedProject', payload: data[0] })
        const userTablesData = await getUserTablesWithProjectId(data[0].id)
        dispatch({ type: 'projects/setUserTablesForProject', payload: userTablesData })
    }

    return (
        <>
            <Card width={"100%"} textAlign={"center"}>
                <CardHeader backgroundColor={"#90a955ff"}>
                    <Heading size='md'>Angelegte Projects</Heading>
                </CardHeader>
            </Card>

            <VStack spacing={".5rem"} overflowX={"hidden"} height={"100%"} width={"100%"}>
                {allProjects?.map((p: any) => {
                    return (
                        <Card minWidth={"200px"} width={"100%"}>
                            <CardBody padding={"1rem"}>
                                <Button
                                    // disabled={addingColumns}
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
        </>
    );
}

export default CreatedProjects;