import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Text, Box, CloseButton, Tooltip } from '@chakra-ui/react'
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
        <Card key={`${columnInfo.id}-geoData-box`}>
            <CardHeader style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                <Heading size='md'>{tableInfo.table_name}</Heading>
                <CloseButton onClick={() => {
                    dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
                    dispatch({ type: 'openLayers/clearTableIdForDrawed', payload: null })
                    dispatch({ type: 'openLayers/clearColumnIdForDrawed', payload: null })
                }} />
            </CardHeader>
            <CardBody>
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
            </CardBody>
        </Card>
    );
}

export default RendernInfo;