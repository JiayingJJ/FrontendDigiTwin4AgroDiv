import {
    Heading, StackDivider, Stack, Text, Box, Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import { MdDeleteForever } from "react-icons/md";
import { deleteGeoDataWithId, setGeoDataStatus } from '../../../api/geoData';
import { fetchUserWithId } from '../../../api/user';
import { useEffect, useState } from 'react';
import { GrStatusGoodSmall } from "react-icons/gr";
import { looksLikeIsoZ, readableTimestamp } from '../../../helpers';
export interface MapData {
    name: string,
    email: string,
    created_at: string,
    data_status: string,
    updated_at: string,
}

const RendernInfo = () => {
    const dispatch = useDispatch()
    const rendernDataInfo = useSelector((state: any) => state.openLayers.rendernDataInfo)
    const columnInfo = useSelector((state: any) => state.openLayers.columnInfo)
    const tableInfo = useSelector((state: any) => state.openLayers.tableInfo)
    const [userEmail, setUserEmail] = useState<String>("");
    const notShow = ["deleted_at", "id", "created_at", "updated_at"]
    const userInfo = useSelector((state: any) => state.user)
    const handlerGetUserEmail = async (value: string) => {
        const data = await fetchUserWithId(value)
        setUserEmail(data[0].email)
    }
    useEffect(() => {
        handlerGetUserEmail(userInfo.id)
        console.log(columnInfo)
    }, [])

    return (
        <Modal closeOnOverlayClick={false} isOpen={rendernDataInfo} onClose={() => {
            dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
            dispatch({ type: 'openLayers/clearTableIdForDrawed', payload: null })
            dispatch({ type: 'openLayers/clearColumnIdForDrawed', payload: null })
        }
        } key={`${columnInfo.id}-geoData-modal`} size={"6xl"}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{tableInfo.table_name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {Object.entries(columnInfo)
                            .filter(([key]) => !notShow.includes(key))
                            .map(([key, value]) => (
                                <Box key={key}>
                                    <Heading size="xs" textTransform="uppercase">{key === "user_id" ? "User Email" : key}</Heading>
                                    <Text pt="2" fontSize="sm">
                                        {key === "data_status" && value === "pending" ? (
                                            <Tooltip label="pending" placement="top-start">
                                                <Box>
                                                    <GrStatusGoodSmall color="red" />
                                                </Box>
                                            </Tooltip>
                                        ) : key === "data_status" && value === "merged" ? (
                                            <Tooltip label="merged" placement="top-start">
                                                <Box>
                                                    <GrStatusGoodSmall color="green" />
                                                </Box>
                                            </Tooltip>
                                        ) : looksLikeIsoZ(value) ? (
                                            readableTimestamp(value)
                                        ) : key === "user_id" ? (
                                            userEmail
                                        ) : (
                                            typeof value === "string" || typeof value === "number"
                                                ? value
                                                : value == null
                                                    ? ""
                                                    : JSON.stringify(value)
                                        )}
                                    </Text>
                                </Box>
                            ))}
                    </Stack>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RendernInfo;