import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    Box,
    HStack,
    VStack,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    RadioGroup,
    Radio,
    Select,
    Tooltip
} from '@chakra-ui/react'
import { MdModeEdit } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";
import CreateColumns from './CreateColumns';
const TableWithColumns = () => {
    const dispatch = useDispatch()
    const editTable = useSelector((state: any) => state.datasetTable.editTable)
    const addingColumns = useSelector((state: any) => state.datasetTable.addingColumns)

    const userTableColumns = useSelector((state: any) => state.datasetTable.userTableColumns)
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const [sortedTableColumns, setSortedTableColumns] = useState<any>();
    useEffect(() => {
        if (tableColumns === undefined || tableColumns === null) return;
        const sortedColumns = [...tableColumns].sort(
            (a, b) => parseInt(a.position) - parseInt(b.position)
        );
        setSortedTableColumns(sortedColumns)

    }, [tableColumns])
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
    return (
        <>
            <Box>{sortedTableColumns?.map(column => renderFormControl(column))}</Box>
            {tableColumns.length !== 0 && <MdModeEdit color="green" cursor={"pointer"} size="25" onClick={() => {
                dispatch({ type: 'datasetTable/setEditTable', payload: true })
                console.log(tableColumns)
                dispatch({ type: 'datasetTable/setUserTableColumns', payload: tableColumns })
            }} />}
            {!addingColumns && editTable && userTableColumns.length !== 0 ? <CreateColumns /> : null}

        </>
    );
}

export default TableWithColumns;