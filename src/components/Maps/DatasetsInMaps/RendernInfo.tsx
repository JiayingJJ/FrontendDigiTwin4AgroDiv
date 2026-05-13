import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Text, Box, CloseButton } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';

const RendernInfo = () => {
    const dispatch = useDispatch()
    const columnInfo = useSelector((state: any) => state.openLayers.columnInfo)
    const tableInfo = useSelector((state: any) => state.openLayers.tableInfo)

    return (
        <Card>
            <CardHeader style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems:"baseline"}}>
                <Heading size='md'>{tableInfo.TableName}</Heading>
                <CloseButton onClick={() => {
                dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
                dispatch({ type: 'openLayers/clearTableIdForDrawed', payload: null })
                dispatch({ type: 'openLayers/clearColumnIdForDrawed', payload: null })
            }} />
            </CardHeader>
            <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                    {Object.entries(columnInfo).map(([key, value]) => (
                        <Box>
                            <Heading size='xs' textTransform='uppercase'>
                                {key}
                            </Heading>
                            <Text pt='2' fontSize='sm'>
                                {value}
                            </Text>
                        </Box>
                    ))}
                </Stack>
            </CardBody>
        </Card>
    );
}

export default RendernInfo;