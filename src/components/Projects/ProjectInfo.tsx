import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    HStack,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    StackDivider,
    Stack,
    Text,
    IconButton,
    Badge,
    VStack, Input, Button
} from '@chakra-ui/react'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { readableTimestamp } from '../../helpers';
import { fetchUserWithId } from '../../api/user';
import AddMember from './AddMember';
import TablesActionForView from './TablesActionForView';
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { getProjectWithCreatorId, setProjectDataStatus, updateProjectInfo } from '../../api/projects';

const ProjectInfo = () => {
    const dispatch = useDispatch()
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userTablesForProject = useSelector((state: any) => state.projects.userTablesForProject)
    const editProject = useSelector((state: any) => state.projects.editProject)
    const [creator, setCreator] = useState<any>();
    const [members, setMembers] = useState<any>();
    const [addMember, setAddMember] = useState<boolean>(false);
    const [viewActions, setViewActions] = useState<boolean>(false);
    const [name, setName] = useState<string>(selectedProject?.name);
    const [description, setDescription] = useState<string>(selectedProject?.description);
    const userInfo = useSelector((state: any) => state.user)
    const selectedUserTable = useSelector((state: any) => state.projects.selectedUserTable)
    const getCreatorInfoWithId = async (id: string) => {
        const data = await fetchUserWithId(id)
        setCreator(data[0])
    }
    const getMemberInfo = async (ids: []) => {
        let m = [];
        ids.forEach(async (i: string) => {
            const data = await fetchUserWithId(i)
            console.log(data[0])
            m.push(data[0].name)
        });
        setMembers(m)
    }
    useEffect(() => {
        if (selectedProject !== null) {
            getCreatorInfoWithId(selectedProject.creator_id)
            getMemberInfo(selectedProject.members.RawMessage)
        }
    }, [selectedProject])
    const handleAddMembersInProject = async () => {
        setAddMember(!addMember)
    }
    const handleDeleteProject = async (p: any) => {
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Project löschen" })
        dispatch({ type: 'modalInfo/setModalBody', payload: `Wollen Sie Project ${p.name} löschen?` })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
        dispatch({ type: 'modalInfo/setModalType', payload: "deleteProject" })
    }
    const handlerEditProject = () => {
        dispatch({ type: 'projects/setEditProject', payload: !editProject })
    }
    const handlerUpdateProjectInfo = async () => {
        const data = await updateProjectInfo(selectedProject.id, name, description);
        dispatch({ type: 'projects/setEditProject', payload: false })

        if (data[1] !== 200) {
        } else {
            const dataStatus = await setProjectDataStatus(selectedProject.id, "merged")
            const projectsWithCreatorId = await getProjectWithCreatorId(userInfo.id)
            if (projectsWithCreatorId[1] !== 200) {
            } else {
                const notDelete = projectsWithCreatorId[0].filter((d: any) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                })
                dispatch({ type: 'projects/setAllProjects', payload: notDelete })
                const selected = notDelete.filter((i: any) => i.id === selectedProject.id)
                dispatch({ type: 'projects/setSelectedProject', payload: selected[0] })
            }
        }
    }
    const handlerCancelEdit = () => {
        dispatch({ type: 'projects/setEditProject', payload: false })
        setName("")
        setDescription("")
    }
    useEffect(() => {
        if (selectedProject !== null) {
            setName(selectedProject.name)
            setDescription(selectedProject?.description.Valid === true && selectedProject?.description.String)
        }
    }, [selectedProject])
    return (
        <HStack alignItems={"start"}>
            <Card width={"100%"}>
                <CardHeader>
                    <HStack spacing={".5rem"} justifyContent={"space-between"}>
                        <Heading size={"md"}>Project Info</Heading>
                        {selectedProject && <HStack>
                            <IconButton disabled={editProject} aria-label='Delete project' icon={<MdDeleteForever cursor={editProject ? "not-allowed" : "pointer"} onClick={() => handleDeleteProject(selectedProject)} size="25" />} />
                            <IconButton disabled={editProject} aria-label='Edit project' icon={<MdModeEdit cursor={editProject ? "not-allowed" : "pointer"} size="25" onClick={handlerEditProject} />} />
                        </HStack>}
                    </HStack>
                </CardHeader>
                {selectedProject !== null && <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform='' paddingBottom={"5px"}>
                                Project Name
                            </Heading>
                            {editProject ? <Input defaultValue={selectedProject.name} backgroundColor={"#ecf39eff"} onChange={(e) => {
                                setName(e.target.value)
                            }} /> : <Text pt='2' fontSize='sm'>
                                {selectedProject.name}
                            </Text>}
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='' paddingBottom={"5px"}>
                                Created At
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {readableTimestamp(selectedProject.created_at)}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='' paddingBottom={"5px"}>
                                Creator
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {creator?.name}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform='' paddingBottom={"5px"}>
                                Description
                            </Heading>
                            {editProject ? <Input backgroundColor={"#ecf39eff"} defaultValue={selectedProject?.description.Valid === true && selectedProject?.description.String} onChange={(e) => {
                                setDescription(e.target.value)
                            }} /> : <Text pt='2' fontSize='sm'>
                                {selectedProject?.description.Valid === true && selectedProject?.description.String}
                            </Text>}
                        </Box>
                        <Box>
                            <HStack>
                                <Heading size='xs' textTransform='uppercase' paddingBottom={"5px"}>
                                    Members
                                </Heading>
                                <IconButton
                                    color='#003569'
                                    aria-label='Search database'
                                    icon={<AiOutlineUsergroupAdd />}
                                    onClick={() => handleAddMembersInProject()}
                                />
                            </HStack>
                            {addMember && <AddMember />}
                            <Stack direction='row' paddingTop={"10px"}>
                                {members?.map((m: string) => {
                                    return (
                                        <Badge colorScheme='green' textTransform=''>{m}</Badge>
                                    )
                                })}
                            </Stack>
                        </Box>
                        <Box>
                            <HStack>
                                <Heading size='xs' textTransform='uppercase' paddingBottom={"5px"}>
                                    Tables
                                </Heading>
                            </HStack>
                            <Stack direction='row' paddingTop={"10px"}>
                                {userTablesForProject?.map((ut: any) => {
                                    return (
                                        <VStack>
                                            <Badge key={`${ut.id}`} colorScheme='green' textTransform='' onClick={() => {
                                                console.log(ut)
                                                dispatch({ type: 'projects/setSelectedUserTable', payload: ut })
                                                setViewActions(!viewActions)
                                            }} cursor={"pointer"}>{ut.table_name}</Badge>
                                            {selectedUserTable !== null && selectedUserTable.id === ut.id && viewActions && <TablesActionForView />}
                                        </VStack>
                                    )
                                })}
                            </Stack>
                        </Box>
                    </Stack>
                </CardBody>}
                <CardFooter>
                    {editProject && <HStack>
                        <Button onClick={handlerUpdateProjectInfo}>Submit</Button>
                        <Button onClick={handlerCancelEdit}>Cancel</Button></HStack>}
                </CardFooter>
            </Card>
        </HStack>
    );
}

export default ProjectInfo;