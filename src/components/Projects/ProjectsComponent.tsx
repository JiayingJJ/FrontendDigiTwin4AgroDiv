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
import { fetchUserWithId } from '../../api/user';
const ProjectsComponent = () => {
    const dispatch = useDispatch()
    const addNewProject = useSelector((state: any) => state.projects.addNewProject)
    const userInfo = useSelector((state: any) => state.user)
    const getUpdateFromDatabase = useSelector((state: any) => state.projects.getUpdateFromDatabase)
    const selectedProjectId = useSelector((state: any) => state.projects.selectedProjectId)
    const getMemberInfo = async (ids: []) => {
        ids.forEach(async (i: string) => {
            const data = await fetchUserWithId(i)
            dispatch({ type: 'projects/addMembersForRedux', payload: { id: data[0].id, name: data[0].name, email: data[0].email } })
        });
    }
    const handleGetAllProjects = async () => {
        let allProject: any = []
        const projectsWithShared = await getAllProjectsWithShared(userInfo.id)
        const dataWithCreatorId = await getProjectWithCreatorId(userInfo.id)
        if (dataWithCreatorId[1] !== 200) { } else {
            const notDelete = dataWithCreatorId[0]?.filter((d: any) => {
                if (!d.deleted_at.Valid) {
                    return d;
                }
            })
            dispatch({ type: 'projects/setOwnedProjects', payload: notDelete })
            notDelete.forEach((e: any) => {
                allProject.push(e)
            });
        }
        if (projectsWithShared[1] !== 200) { } else {
            const notDelete = projectsWithShared[0]?.filter((d: any) => {
                if (!d.deleted_at.Valid) {
                    return d;
                }
            })
            dispatch({ type: 'projects/setSharedProjects', payload: notDelete })
            notDelete.forEach((e: any) => {
                allProject.push(e)
            });
        }
        dispatch({ type: 'projects/setAllProjects', payload: allProject })
        const selected = allProject.filter((i: any) => i.id === selectedProjectId)
        if (selected.length !== 0) {
            dispatch({ type: 'projects/setSelectedProject', payload: selected[0] })
            await getMemberInfo(selected[0].members.RawMessage)
        }
    }
    useEffect(() => {
        const run = async () => {
            dispatch({ type: 'projects/clearProjectState', payload: null })
            await handleGetAllProjects()
        }
        run()
    }, [])

    useEffect(() => {
        const run = async () => {
            if (getUpdateFromDatabase) {
                dispatch({ type: 'projects/clearProjectState', payload: null })
                dispatch({ type: 'projects/clearMembersForRedux', payload: null })
                await handleGetAllProjects()
                dispatch({ type: 'projects/setGetUpdateFromDatabase', payload: false })
            }
        }
        run()
    }, [getUpdateFromDatabase])

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