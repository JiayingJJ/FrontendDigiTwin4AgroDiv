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
    CloseButton
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import { getAllProjects, getProjectWithCreatorId } from '../../api/projects';
import AddProject from './AddProject';
import CreatedProjects from './CreatedProjects';
const ProjectsComponent = () => {
    const dispatch = useDispatch()
        const addNewProject = useSelector((state: any) => state.projects.addNewProject)
        const userInfo = useSelector((state: any) => state.user)
    
    const handlerGetAllProjects = async () => {
        const data = await getAllProjects();
        console.log(data)
        const dataWithCreatorId = await getProjectWithCreatorId(userInfo.id)
        console.log(dataWithCreatorId)
        
        if(dataWithCreatorId[1]!==200){

        }else{
            const notDelete = dataWithCreatorId[0].filter((d: any) =>{if (!d.deleted_at.Valid) {
                        return d;
                    }})
                    dispatch({ type: 'projects/setAllProjects', payload: notDelete})

        }
    }
    useEffect(() => {
        handlerGetAllProjects()
    }, [])
    return (
        <VStack>
            <CreatedProjects/>
            <Button disabled={addNewProject} backgroundColor='#EDB458' onClick={() => {
                console.log("click for add project")
                    dispatch({ type: 'projects/setAddNewProject', payload: true })
            }}>
                Füge ein neue Projekt hinzu
            </Button>
            {addNewProject && <AddProject/>}
        </VStack>

    );
}

export default ProjectsComponent;