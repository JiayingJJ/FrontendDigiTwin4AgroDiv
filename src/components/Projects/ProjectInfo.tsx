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
    VStack
} from '@chakra-ui/react'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { readableTimestamp } from '../../helpers';
import { fetchUserWithId } from '../../api/user';
import AddMember from './AddMember';
import TablesActionForView from './TablesActionForView';
import { MdDeleteForever } from "react-icons/md";


const ProjectInfo = () => {
    const dispatch = useDispatch()
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const userTablesForProject = useSelector((state: any) => state.projects.userTablesForProject)
    const [creator, setCreator] = useState<any>();
    const [members, setMembers] = useState<any>();
    const [addMember, setAddMember] = useState<boolean>(false);
    const [viewActions, setViewActions] = useState<boolean>(false);
    const selectedUserTable = useSelector((state: any) => state.projects.selectedUserTable)

    console.log(selectedProject)
    const getCreatorInfoWithId = async (id: string) => {
        const data = await fetchUserWithId(id)
        console.log(data)
        setCreator(data[0])
    }
    const getMemberInfo = async (ids: []) => {
        let m = [];
        console.log(ids)
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
        console.log("add members")
        setAddMember(!addMember)

    }
    const handleDeleteProject = async (p: any) => {
        dispatch({ type: 'modalInfo/setShowModal', payload: true })
        dispatch({ type: 'modalInfo/setModalHeader', payload: "Project löschen" })
        dispatch({ type: 'modalInfo/setModalBody', payload: `Wollen Sie Project ${p.name} löschen?` })
        dispatch({ type: 'modalInfo/setSaveBtnInfo', payload: "Bestätigen" })
        dispatch({ type: 'modalInfo/setModalType', payload: "deleteProject" })
    }
    return (
        <HStack alignItems={"start"}>
            <Card width={"100%"}>
                <CardHeader>
                    <HStack spacing={".5rem"} justifyContent={"space-between"}>
                        <Heading size={"md"}>Project Info</Heading>
                        <MdDeleteForever cursor={"pointer"} onClick={() => handleDeleteProject(selectedProject)} size="25" />
                    </HStack>
                </CardHeader>
                {selectedProject !== null && <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading size='xs' textTransform=''>
                                Project Name
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {selectedProject.name}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform=''>
                                Created At
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {readableTimestamp(selectedProject.created_at)}
                            </Text>
                        </Box>
                        <Box>
                            <Heading size='xs' textTransform=''>
                                Creator
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {creator?.name}
                            </Text>
                        </Box>
                         <Box>
                            <Heading size='xs' textTransform=''>
                                Description
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {selectedProject?.description.Valid===true && selectedProject?.description.String}
                            </Text>
                        </Box>
                        <Box>
                            <HStack>
                                <Heading size='xs' textTransform='uppercase'>
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
                                <Heading size='xs' textTransform='uppercase'>
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

                </CardFooter>
            </Card>
        </HStack>
    );
}

export default ProjectInfo;