import { Card, CardHeader, CardBody, CardFooter, Heading, StackDivider, Stack, Text, Box } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';

const RendernInfo = () => {
    const columnInfo = useSelector((state: any) => state.openLayers.columnInfo)
    const tableInfo = useSelector((state: any) => state.openLayers.tableInfo)

    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{tableInfo.TableName}</Heading>
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