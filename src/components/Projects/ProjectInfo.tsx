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
    Badge
} from '@chakra-ui/react'
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { readableTimestamp } from '../../helpers';
import { fetchUserWithId } from '../../api/user';
import AddMember from './AddMember';

const ProjectInfo = () => {
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)
    const [creator, setCreator] = useState<any>();
    const [members, setMembers] = useState<any>();
    const [addMember, setAddMember] = useState<boolean>(false);
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
    console.log(members)
    return (
        <HStack alignItems={"start"}>
            {selectedProject !== null && <Card width={"100%"}>
                <CardHeader>
                    <Heading size={"md"}>{selectedProject.name}</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
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
                    </Stack>
                </CardBody>
                <CardFooter>

                </CardFooter>
            </Card>}
        </HStack>
    );
}

export default ProjectInfo;