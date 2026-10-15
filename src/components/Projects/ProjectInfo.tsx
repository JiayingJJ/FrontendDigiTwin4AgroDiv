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
    Tooltip,
    VStack, Input, Button
} from '@chakra-ui/react'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { readableTimestamp } from '../../helpers';
import { fetchUserWithId } from '../../api/user';
import AddMember from './AddMember';
import TablesActionForView from './TablesActionForView';
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import { getProjectWithCreatorId, removeProjectMemberWithUserId, setProjectDataStatus, updateProjectInfo } from '../../api/projects';
import { buttonBadStyle, buttonIconStyle, buttonStyle, buttonGoodStyle, colorDanger } from '../Dashboard';

const ProjectInfo = () => {
    const dispatch = useDispatch()
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const selectedProjectId = useSelector((state: any) => state.projects.selectedProjectId)
    const userTablesForProject = useSelector((state: any) => state.projects.userTablesForProject)
    const editProject = useSelector((state: any) => state.projects.editProject)
    const addMember = useSelector((state: any) => state.projects.addMember)
    const membersForRedux = useSelector((state: any) => state.projects.membersForRedux)
    const [creator, setCreator] = useState<any>();
    const [viewActions, setViewActions] = useState<boolean>(false);
    const [memberActions, setMemberActions] = useState<boolean>(false);
    const [name, setName] = useState<string>(selectedProject?.name);
    const [description, setDescription] = useState<string>(selectedProject?.description);
    const userInfo = useSelector((state: any) => state.user)
    const selectedUserTable = useSelector((state: any) => state.projects.selectedUserTable)
    const getCreatorInfoWithId = async (id: string) => {
        const data = await fetchUserWithId(id)
        setCreator(data[0])
    }
    useEffect(() => {
        if (selectedProject !== null && selectedProject !== undefined) {
            getCreatorInfoWithId(selectedProject?.creator_id)
        }
    }, [])
    const handleAddMembersInProject = async () => {
        dispatch({ type: 'projects/setAddMember', payload: true })
    }
    const handleDeleteProject = async (p: any) => {
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Delete Project" })
        dispatch({ type: 'modalInfo/setModalBody', payload: (<>Are you sure that you want to delete <strong>{p.name}</strong>?</>) })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Delete" })
        dispatch({ type: 'modalInfo/setModalType', payload: "deleteProject" })
    }
    const handleEditProject = () => {
        dispatch({ type: 'projects/setEditProject', payload: !editProject })
    }
    const handleUpdateProjectInfo = async () => {
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
    const handleCancelEdit = () => {
        dispatch({ type: 'projects/setEditProject', payload: false })
        setName("")
        setDescription("")
    }
    useEffect(() => {
        if (selectedProject !== null && selectedProject !== undefined) {
            setName(selectedProject.name)
            setDescription(selectedProject?.description.Valid === true && selectedProject?.description.String)
        }
    }, [selectedProject])

    const handleRemoveMemberFromAProject = async (userInfo: any) => {
        const data = await removeProjectMemberWithUserId(selectedProjectId, userInfo.id)
        if (data[1] !== 200) {

        } else {
            const statusData = await setProjectDataStatus(selectedProjectId, "merged")
            dispatch({ type: 'projects/setGetUpdateFromDatabase', payload: true })
        }
    }
    return (
        <HStack alignItems={"start"}>
            <Card width={"100%"}>
                <CardHeader>
                    <HStack spacing={".5rem"} justifyContent={"space-between"}>
                        <Heading size={"md"}>Project Info</Heading>
                        {selectedProject && userInfo.id === selectedProject.creator_id && <HStack>
                            <IconButton {...buttonIconStyle} disabled={editProject} aria-label='Edit project' icon={<MdModeEdit cursor={editProject ? "not-allowed" : "pointer"} size="25" />} onClick={handleEditProject} />
                            <IconButton {...buttonIconStyle} color={colorDanger} disabled={editProject} aria-label='Delete project' icon={<MdDeleteForever cursor={editProject ? "not-allowed" : "pointer"} size="25" />} onClick={() => handleDeleteProject(selectedProject)} />
                        </HStack>}
                    </HStack>
                </CardHeader>
                {selectedProject !== null && selectedProject !== undefined && <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' paddingBottom={"5px"}>
                                Project Name
                            </Heading>
                            {editProject ? <Input defaultValue={selectedProject.name} backgroundColor={"#ecf39eff"} onChange={(e) => {
                                setName(e.target.value)
                            }} /> : <Text pt='2' fontSize='sm'>
                                {selectedProject.name}
                            </Text>}
                        </Box>
                        <Box>
                            <Heading size='xs' paddingBottom={"5px"}>
                                Created At
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {readableTimestamp(selectedProject.created_at)}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' paddingBottom={"5px"}>
                                Creator
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {creator?.name}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' paddingBottom={"5px"}>
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
                                <Heading size='xs' paddingBottom={"5px"}>
                                    Members
                                </Heading>
                                {userInfo.id === selectedProject.creator_id && <IconButton
                                    {...buttonIconStyle}
                                    aria-label='Search database'

                                    icon={<AiOutlineUsergroupAdd />}
                                    onClick={() => handleAddMembersInProject()}
                                />}
                            </HStack>
                            {addMember && <AddMember />}
                            <Stack direction='row' paddingTop={"10px"}>
                                {membersForRedux?.map((m: any) => {
                                    return (
                                        <VStack>
                                            <Button {...buttonStyle} size="sm" onClick={() => setMemberActions(!memberActions)}>{m.name}</Button>
                                            {memberActions && userInfo.id === selectedProject.creator_id &&
                                                <IconButton {...buttonIconStyle} color={colorDanger} aria-label='Remove member' icon={<MdDeleteForever cursor={"pointer"} onClick={() => handleRemoveMemberFromAProject(m)} size="25" />} />
                                            }
                                        </VStack>
                                    )
                                })}
                            </Stack>
                        </Box>
                        <Box>
                            <HStack>
                                <Heading size='xs' paddingBottom={"5px"}>
                                    Tables
                                </Heading>
                            </HStack>
                            <Stack direction='row' paddingTop={"10px"}>
                                {userTablesForProject?.map((ut: any) => {
                                    return (
                                        <VStack>
                                            <Button {...buttonStyle} key={`${ut.id}`} onClick={() => {
                                                console.log(ut)
                                                dispatch({ type: 'projects/setSelectedUserTable', payload: ut })
                                                setViewActions(!viewActions)
                                            }}>{ut.table_name}</Button>
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
                        <Button {...buttonGoodStyle} onClick={handleUpdateProjectInfo}>Submit</Button>
                        <Button {...buttonBadStyle} onClick={handleCancelEdit}>Cancel</Button>
                    </HStack>}
                </CardFooter>
            </Card>
        </HStack>
    );
}

export default ProjectInfo;