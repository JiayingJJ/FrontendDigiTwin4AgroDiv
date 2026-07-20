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
import { getAllProjects, getProjectWithCreatorId } from '../../api/projects';
import AddProject from './AddProject';
import CreatedProjects from './CreatedProjects';
import ProjectInfo from './ProjectInfo';
const ProjectsComponent = () => {
    const dispatch = useDispatch()
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)
    const userInfo = useSelector((state: any) => state.user)

    const handlerGetAllProjects = async () => {
        const data = await getAllProjects();
        const dataWithCreatorId = await getProjectWithCreatorId(userInfo.id)

        if (dataWithCreatorId[1] !== 200) {

        } else {
            const notDelete = dataWithCreatorId[0].filter((d: any) => {
                if (!d.deleted_at.Valid) {
                    return d;
                }
            })
            dispatch({ type: 'projects/setAllProjects', payload: notDelete })
        }
    }
    useEffect(() => {
        handlerGetAllProjects()
        dispatch({ type: 'projects/clearProjectState', payload: null })
    }, [])
    return (
        <Grid templateColumns={`repeat(6, 1fr)`} gap={6} width={"90vw"} height={"100%"} padding={"0 0 2vh 0"}>
            <GridItem h='100%' w="100%">
                <VStack spacing={".5rem"} overflowX={"hidden"} width={"100%"}>
                    <CreatedProjects />
                    <Button disabled={addNewProject} backgroundColor='#ecf39eff' onClick={() => {
                        console.log("click for add project")
                        dispatch({ type: 'projects/setAddNewProject', payload: true })
                    }}>
                        Füge ein neue Projekt hinzu
                    </Button>
                    {addNewProject && <AddProject />}
                </VStack>
            </GridItem>
            <GridItem colSpan={5} h='100%'>
                <ProjectInfo />
            </GridItem>
        </Grid>
    );
}

export default ProjectsComponent;