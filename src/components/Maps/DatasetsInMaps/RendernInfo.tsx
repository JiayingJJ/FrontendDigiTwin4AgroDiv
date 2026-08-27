import {
    Heading, StackDivider, Stack, Text, Box, Tooltip,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
    VStack
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import { MdDeleteForever } from "react-icons/md";
import { deleteGeoDataWithId, setGeoDataStatus } from '../../../api/geoData';
import { fetchUserWithId } from '../../../api/user';
import { useEffect, useState } from 'react';
import { GrStatusGoodSmall } from "react-icons/gr";
import { looksLikeIsoZ, readableTimestamp } from '../../../helpers';
import { downloadImage } from '../../../api/file';
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
    const editColumn = useSelector((state: any) => state.openLayers.editColumn)
    const [userEmail, setUserEmail] = useState<String>("");
    const shouldShow = ["data_status", "user_id"]
    const userInfo = useSelector((state: any) => state.user)
    const [image, setImage] = useState<any[]>([])
    const [largeImage, setLargeImage] = useState<any>(null);
    const handleGetUserEmail = async (value: string) => {
        const data = await fetchUserWithId(value)
        setUserEmail(data[0].email)
    }
    useEffect(() => {
        handleGetUserEmail(userInfo.id)
    }, [])
    useEffect(() => {
        const run = async () => {
            const blobs: any[] = [];
            await Promise.all(
                tableInfo?.columns_in_table?.RawMessage.map(async (raw: any) => {
                    if (raw.type === "image" && columnInfo !== null) {
                        const name = raw.name.toLowerCase().replaceAll(" ", "_");
                        const data = await downloadImage(columnInfo[name]);
                        blobs.push({ colName: name, data: data });
                    }
                }) ?? []
            );
            blobs.map((b) => {
                const url = URL.createObjectURL(b.data)
                b.data = url
                return url
            });
            setImage(blobs);
        };
        run();
        return () => {
        };
    }, [tableInfo, columnInfo]);
    return (
        <Modal closeOnOverlayClick={false} isOpen={rendernDataInfo} onClose={() => {
            dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
            dispatch({ type: 'openLayers/clearTableIdForDrawed', payload: null })
            dispatch({ type: 'openLayers/clearColumnIdForDrawed', payload: null })
        }
        } key={`${columnInfo?.id}-geoData-modal`} size={"6xl"}>
            <ModalOverlay />
            <ModalContent maxHeight={"75vh"}>
                <ModalHeader>{tableInfo?.table_name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6} overflowY={"auto"}>
                    {largeImage
                        ? <Box height={"100%"}>
                            <Heading size="md" marginBottom={"1rem"}>{largeImage.heading}</Heading>
                            <Image
                                cursor={"zoom-out"} 
                                src={largeImage.src} onClick={() => { setLargeImage(null) }} />
                        </Box>
                        : <Stack divider={<StackDivider />} spacing='4'>
                            {columnInfo !== null && Object.entries(columnInfo)
                                .filter(([key]) => shouldShow.includes(key))
                                .map(([key, value]) => (
                                    <Box key={key}>
                                        <Heading size="xs">{key === "user_id" ? "User email" : "Data status"}</Heading>
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
                                            ) : key === "user_id" ? (
                                                userEmail
                                            ) : null}
                                        </Text>
                                    </Box>
                                ))}
                            {columnInfo !== null && tableInfo?.columns_in_table?.RawMessage.map((raw: any) => {
                                const field = raw.name.toLowerCase().replaceAll(" ", "_");
                                const cellValue = columnInfo[field];
                                return (
                                    <VStack key={field} align="start">
                                        <Heading size={"xs"}>{raw.name}</Heading>
                                        {raw.type === "image" ?
                                            <>
                                                {Object.entries(image).map((key) => {
                                                    console.log(key)
                                                    console.log(key[1])
                                                    if (key[1].colName === raw.name.toLowerCase().replaceAll(" ", "_")) {
                                                        return (
                                                            <Image width="30%" height="30%" src={key[1].data}
                                                                cursor={"zoom-in"}
                                                                onClick={() => {
                                                                    setLargeImage({
                                                                        heading: raw.name,
                                                                        src: key[1].data,
                                                                    })
                                                                }}
                                                            />
                                                        )
                                                    }
                                                })}</> :
                                            raw.type === "timestamp" ?
                                                <Text>{readableTimestamp(cellValue)}</Text> :
                                                <Text>{cellValue}</Text>
                                        }
                                    </VStack>
                                )
                            })}
                        </Stack>
                    }
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default RendernInfo;