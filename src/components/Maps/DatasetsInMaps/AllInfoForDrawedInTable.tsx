import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, CardFooter, Heading, Badge, Stack, Box, Text, Button, HStack, VStack, FormControl, FormLabel, Select } from '@chakra-ui/react'
import { MdDeleteForever } from "react-icons/md";
import { getColumnWithId } from '../../../api/dataset';
import { fetchTableWithId } from '../../../api/userTables';
import { deleteGeoDataWithId, removeColumnInGeoDataProperties, setGeoDataStatus, updateProjectIdInGeoData } from '../../../api/geoData';
import { FiPlusCircle } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { removeDataFromUserTablesId } from '../../../api/userTableId';
import { readableTimestamp } from '../../../helpers';
import DatasetColumns from './DatasetColumns';
import { updateProjectGeoIds } from '../../../api/projects';
import { CiCircleCheck } from 'react-icons/ci';
const AllInfoForDrawedInTable = () => {

    const dispatch = useDispatch()
    const allInfoInProperties = useSelector((state: any) => state.openLayers.allInfoInProperties)
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const selectedPropertiesFromDatabase = useSelector((state: any) => state.openLayers.selectedPropertiesFromDatabase)
    const columnInfo = useSelector((state: any) => state.openLayers.columnInfo)
    const selectedGeoInfo = useSelector((state: any) => state.openLayers.selectedGeoInfo)
    const tableInfo = useSelector((state: any) => state.openLayers.tableInfo)
    const tables = useSelector((state: any) => state.datasetTable.tables)
    const userInfo = useSelector((state: any) => state.user)
    const allProjects = useSelector((state: any) => state.projects.allProjects)
    const projectId = useSelector((state: any) => state.openLayers.projectId)
    const selectedGeoData = useSelector((state: any) => state.openLayers.selectedGeoData)

    const clickOnSaveBtn = async () => {

    }
    const clickOnCancelBtn = () => {
    }

    const handleGetData = async (geo: any) => {
        await getGeoData(geo)
        dispatch({ type: 'openLayers/setRendernDataInfo', payload: true })
    }
    const getGeoData = async (column: any) => {
        let info: any;
        let dataColumn: any;
        let dataTable: any;
        if (selectedPropertiesFromDatabase.length !== undefined) {
            info = selectedPropertiesFromDatabase.filter((i: any) => column.id === i.column_id)
            dataColumn = await getColumnWithId(info[0].table_id, info[0].column_id)
            dataTable = await fetchTableWithId(info[0].table_id)
        } else {
            info = selectedPropertiesFromDatabase
            dataColumn = await getColumnWithId(info.table_id, info.column_id)
            dataTable = await fetchTableWithId(info.table_id)
        }
        dispatch({ type: 'openLayers/setColumnInfo', payload: dataColumn })
        dispatch({ type: 'openLayers/setTableInfo', payload: dataTable[0] })
    }
    const handleDeleteGeoDataAndColumn = async (column: any) => {
        await getGeoData(column)
        const deleteUserTableIdColumn = await removeDataFromUserTablesId(columnInfo?.id, tableInfo?.id)
        dispatch({ type: 'openLayers/setGetUpdateFromDatabase', payload: true })
        if (column.geo_data_id && column.geo_data_id !== null && column.geo_data_id !== undefined) {
            const removeColumnFronProperties = await removeColumnInGeoDataProperties(columnInfo?.id, column.geo_data_id, tableInfo?.id)
            if (removeColumnFronProperties[1] === 200) {
                const dataStatus = await setGeoDataStatus(column.geo_data_id, "merged");
            }
        }
    }
    const handleUpdateGeoDataAndColumn = async (column: any) => {
        await getGeoData(column)
        dispatch({ type: 'openLayers/setEditColumn', payload: true })
        const tableInfo = selectedPropertiesFromDatabase.filter((i: any) => i.column_id === column.id)
        dispatch({ type: 'openLayers/setSelectedColumnId', payload: tableInfo[0].column_id })
        const data = tables.filter((i: any) => i.id === tableInfo[0].table_id)
        dispatch({ type: 'datasetTable/setSelectedTableId', payload: data[0].id })
        dispatch({ type: 'datasetTable/setSelectedTable', payload: data[0] })
        dispatch({ type: 'datasetTable/setTableColumns', payload: data[0].columns_in_table.RawMessage })
        dispatch({ type: 'datasetTable/setUserInputColumnValues', payload: data[0].columns_in_table.RawMessage })
        data[0].columns_in_table.RawMessage.forEach((elem: any) => {
            dispatch({ type: 'datasetTable/updateUserInputColumnValuesWithName', payload: { name: elem.name, value: column[elem.name.toLowerCase().replaceAll(" ", "_")] } })
        });
    }
    const handleAddNewData = async () => {
        dispatch({ type: 'openLayers/setEditColumn', payload: false })
        dispatch({ type: 'datasetTable/clearInfoForASelectedTable', payload: null })
        dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: true })
    }
    const handleSelectProject = (e: any) => {
        dispatch({ type: 'openLayers/setProjectId', payload: e.target.value })
    }
    const handlePostProjectId = async () => {
        const data = await updateProjectGeoIds(projectId, selectedGeoInfo.id, "pending")
        const geoDataData = await updateProjectIdInGeoData(selectedGeoInfo.id, projectId, "pending")
        dispatch({ type: 'pageInfo/setGetUpdate', payload: true })
        // const data = await removeProjectGeoIdsWithGeoId(projectId, selectedGeoInfo.id, "pending")
        console.log(data)
        console.log(geoDataData)
    }
    const getProjectsName = () => {
        let projects: any = []
        selectedGeoData?.project_ids.RawMessage.map((p: string) => allProjects.filter((a: any) => {
            if (a.id === p) {
                projects.push(a)
            }
        }))
        return projects
    }
    return (
        <VStack spacing={".5rem"} overflowX={"hidden"} height={"auto"} width={"100%"}>
            <VStack style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }} backgroundColor={"#90a955ff"} width={"100%"} border={"5px"} borderRadius={"5px"} padding={"5px"}>
                <Heading size='md'>Project Info</Heading>
                <Stack direction='row'>
                    {selectedGeoData?.project_ids?.RawMessage!==null && getProjectsName().map((p: any) => {
                        return <Badge colorScheme='green'>{p.name}</Badge>

                    })}
                </Stack>
                <Box>
                    <HStack style={{ display: "flex", alignItems: "end", width: "100%" }}>
                        <FormControl>
                            <Select placeholder='Select project'
                                onChange={handleSelectProject}
                                key={"select-project"}>
                                {allProjects.map((p: any) => {
                                    const exist = p?.geo_ids?.RawMessage.filter((e: string) => e === selectedGeoInfo?.id)
                                    return (
                                        <option value={p.id} disabled={exist.length !== 0}>{p.name}</option>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <CiCircleCheck color="green"
                            size="40"
                            onClick={() => handlePostProjectId()}
                        />
                    </HStack>
                </Box>
            </VStack>
            <HStack style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} backgroundColor={"#90a955ff"} width={"100%"} border={"5px"} borderRadius={"5px"} padding={"5px"}>
                <Heading size='md'>Dateneinsätze</Heading>
                <Box>
                    <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" cursor={"pointer"} onClick={() => handleAddNewData()} />
                </Box>
            </HStack>
            {allInfoInProperties?.map((c: any) => {
                return (
                    // <Card minWidth={"200px"} width={"100%"} key={`${geo.id}-type`}>
                    <HStack spacing={".5rem"} justifyContent={"space-around"} key={`${c.id}-dataset-btn`}>
                        <Button
                            // disabled={addDrawedInteractionInfo}
                            backgroundColor={columnInfo?.id === c.id ? "#ba2d0bff" : "#F7EDE2"}
                            onClick={() => {
                                handleGetData(c)
                            }}
                            cursor={"pointer"}
                            key={`${c.id}-geoData-box`}>
                            <Heading size='xs' textTransform='uppercase' padding={"10px"}>
                                {readableTimestamp(c.updated_at)}
                            </Heading>
                        </Button>
                        {c.user_id === userInfo.id && <Box style={{ display: "flex", alignItems: "center" }}>
                            <MdDeleteForever cursor={"pointer"} onClick={() => handleDeleteGeoDataAndColumn(c)} size="25" />
                            <MdModeEdit cursor={"pointer"} size="25" onClick={() => handleUpdateGeoDataAndColumn(c)} />
                        </Box>}
                    </HStack>
                )
            })}

            <DatasetColumns />
        </VStack>
    );
}

export default AllInfoForDrawedInTable;