import React, { useEffect } from 'react';
import {
    Button,
    Box,
    HStack,
    VStack,
    Alert,
    AlertTitle,
    AlertDescription,
    AlertIcon,
    CloseButton,
    Grid,
    GridItem,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjects, getAllProjectsWithShared, getProjectWithCreatorId } from '../../api/projects';
import AddProject from './AddProject';
import CreatedProjects from './CreatedProjects';
import ProjectInfo from './ProjectInfo';
const ProjectsComponent = () => {
    const dispatch = useDispatch()
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)
    const userInfo = useSelector((state: any) => state.user)

    const handleGetAllProjects = async () => {
        const data = await getAllProjects();
        const projectsWithShared = await getAllProjectsWithShared(userInfo.id)
        const dataWithCreatorId = await getProjectWithCreatorId(userInfo.id)
        if (projectsWithShared[1] !== 200) {

        } else {
            const notDelete = projectsWithShared[0].filter((d: any) => {
                if (!d.deleted_at.Valid) {
                    return d;
                }
            })
            dispatch({ type: 'projects/setAllProjects', payload: notDelete })
        }
    }
    useEffect(() => {
        dispatch({ type: 'projects/clearProjectState', payload: null })
        handleGetAllProjects()
    }, [])
    return (
        <Grid templateColumns={`repeat(7, 1fr)`} gap={3} width={"95vw"} height={"90vh"} padding={"0 0 2vh 0"}>
            <GridItem colSpan={2} h='100%' w="100%">
                <VStack spacing={".5rem"} overflowX={"hidden"} width={"100%"}>
                    <CreatedProjects />
                    <AddProject />
                </VStack>
            </GridItem>
            <GridItem colSpan={5} h='100%'>
                <ProjectInfo />
            </GridItem>
        </Grid>
    );
}

export default ProjectsComponent;