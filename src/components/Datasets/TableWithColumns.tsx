import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    HStack,
    FormControl,
    FormLabel,
    Input,
    RadioGroup,
    Radio,
    Select,
    Tooltip,
    Button,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Text,
} from '@chakra-ui/react'
import { MdModeEdit } from "react-icons/md";
import { CiCircleCheck, CiCircleInfo } from "react-icons/ci";
import CreateColumns from './CreateColumns';
import { getProjectWithId } from '../../api/projects';
import { setUserTableProjectId } from '../../api/userTables';
const TableWithColumns = () => {
    const dispatch = useDispatch()
    const editTable = useSelector((state: any) => state.datasetTable.editTable)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)

    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const [sortedTableColumns, setSortedTableColumns] = useState<any>();
    const isChangingColumns = useSelector((state: any) => state.datasetTable.isChangingColumns)
    const newColumns = useSelector((state: any) => state.datasetTable.newColumns)
    const removedColumns = useSelector((state: any) => state.datasetTable.removedColumns)
    const selectedTable = useSelector((state: any) => state.datasetTable.selectedTable)
    const [projectName, setProjectName] = useState<string>("");
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const projectId = useSelector((state: any) => state.datasetTable.projectId)
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)
    const editedColumns = useSelector((state: any) => state.datasetTable.editedColumns)

    useEffect(() => {
        if (tableColumns === undefined || tableColumns === null) return;
        const sortedColumns = [...tableColumns].sort(
            (a, b) => parseInt(a.position) - parseInt(b.position)
        );
        setSortedTableColumns(sortedColumns)

    }, [tableColumns])
    useEffect(() => {
        if (isChangingColumns.length === 0 && (newColumns.length !== 0 || editedColumns.length !== 0 || removedColumns.length !== 0)) {
            dispatch({ type: 'datasetTable/setHasChanged', payload: true })
        } else {
            dispatch({ type: 'datasetTable/setHasChanged', payload: false })
        }
    }, [isChangingColumns, newColumns, editedColumns, removedColumns])
    const renderFormControl = (column: any) => {
        const key = column.name;

        switch (column.type) {
            case 'radio':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel as='legend'>{column.name}</FormLabel>
                        <RadioGroup defaultValue='Ja'>
                            <HStack spacing='24px'>
                                <Radio value='Ja'>Ja</Radio>
                                <Radio value='Nein'>Nein</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                );
            case 'select':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Select placeholder='auswählen'>
                                {column.additional_info.options.map((o: string) => {
                                    return (<option>{o}</option>)
                                })}
                            </Select>
                            <Tooltip label={`${column.hint}`} hasArrow placement='top-end'>
                                <Box>
                                    <CiCircleInfo color="green" cursor={"pointer"} size="40" />
                                </Box>
                            </Tooltip>
                        </Box>
                    </FormControl>
                );
            case 'text':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Input placeholder={`${column.hint}`} />
                            <Tooltip label={`${column.hint}`} hasArrow placement='top-end'>
                                <Box>
                                    <CiCircleInfo color="green" cursor={"pointer"} size="40" />
                                </Box>
                            </Tooltip>
                        </Box>
                    </FormControl>
                );
            case 'timestamp':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Input placeholder={`${column.hint}`} />
                            <Tooltip label={`${column.hint}`} hasArrow placement='top-end'>
                                <Box>
                                    <CiCircleInfo color="green" cursor={"pointer"} size="40" />
                                </Box>
                            </Tooltip>
                        </Box>
                    </FormControl>
                );
            case 'real':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Input placeholder={`${column.hint}`} />
                            <Tooltip label={`${column.hint}`} hasArrow placement='top-end'>
                                <Box>
                                    <CiCircleInfo color="green" cursor={"pointer"} size="40" />
                                </Box>
                            </Tooltip>
                        </Box>
                    </FormControl>
                );
            case 'integer':
                return (
                    <FormControl key={`${column.id}-tooltip`}>
                        <FormLabel>{column.name}</FormLabel>
                        <Box style={{ display: "flex", flexDirection: "row" }}>
                            <Input placeholder={`${column.hint}`} />
                            <Tooltip label={`${column.hint}`} hasArrow placement='top-end'>
                                <Box>
                                    <CiCircleInfo color="green" cursor={"pointer"} size="40" />
                                </Box>
                            </Tooltip>
                        </Box>
                    </FormControl>
                );
            default:
                return <div key={key}>Unbekannter Feldtyp: {column.type}</div>;
        }
    }
    const handleGetProjectInfo = async () => {
        if (selectedTable.project_id !== undefined && selectedTable.project_id.String !== '') {
            const data = await getProjectWithId(selectedTable.project_id.String)
            console.log(data[0])
            setProjectName(data[0].name)
        }
    }
    useEffect(() => {
        setProjectName('')
        if (selectedTable !== null)
            handleGetProjectInfo()
    }, [selectedTable])
    const handleSelectProject = (e: any) => {
        dispatch({ type: 'datasetTable/setProjectId', payload: e.target.value })
    }
    const handlePostProjectId = async() => {
        const data = await setUserTableProjectId(selectedTableId, projectId, "pending")
    }
    return (
        <HStack alignItems={"start"}>
            {!addingColumns && editTable && userTableColumns.length !== 0 &&
                <Card width={"200%"}>
                    <CardBody>
                        <CreateColumns />
                    </CardBody>
                </Card>
            }
            <Card width={"100%"}>
                <CardHeader>
                    <Heading size={"md"}>Input preview</Heading>
                </CardHeader>
                <CardBody>
                    {(selectedTable !== null && selectedTable.project_id !== undefined && selectedTable.project_id.String !== '') ? <Box>
                        <Heading size='xs' textTransform=''>
                            Project Name
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                            {projectName}
                        </Text>
                    </Box> :
                        <Box>
                            <FormControl>
                                <FormLabel>Project</FormLabel>
                                <Select placeholder='Select project' onChange={handleSelectProject}>
                                    {allProjects.map((p: any) => {
                                        return (
                                            <option value={p.id}>{p.name}</option>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                           <CiCircleCheck color="green" 
                           cursor={projectId===null ? "not-allowed" : "pointer"}
                            size="40" onClick={() => handlePostProjectId()
                           } />
                        </Box>
                    }
                    {sortedTableColumns?.map(column => renderFormControl(column))}
                </CardBody>
                <CardFooter>
                    {tableColumns !== null && tableColumns.length !== 0 &&
                        <Button colorScheme="green" onClick={() => {
                            dispatch({ type: 'datasetTable/setEditTable', payload: true })
                            console.log(tableColumns)
                            dispatch({ type: 'datasetTable/setUserTableColumns', payload: tableColumns })
                        }} >
                            <Box marginRight={".5rem"}>Edit Columns</Box>
                            <MdModeEdit color="white" cursor={"pointer"} size="25" />
                        </Button>
                    }
                </CardFooter>
            </Card>
        </HStack>
    );
}

export default TableWithColumns;