import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, IconButton, HStack,
} from "@chakra-ui/react";
import { readableTimestamp } from "../../helpers";
import ImageView from "./ImageView";
import { MdDeleteForever, MdModeEdit, MdCancel } from "react-icons/md";
import { removeDataFromUserTablesId } from "../../api/userTableId";

function Tables() {
    const dispatch = useDispatch();
    const editData = useSelector((state: any) => state.datasetTableView.editData);
    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)
    const data = useSelector((state: any) => state.datasetTableView.data);
    const tableName = useSelector((state: any) => state.datasetTableView.tableName);
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable);
    const deleteData = useSelector((state: any) => state.datasetTableView.deleteData);
    const selectedTableId = useSelector((state: any) => state.datasetTable.selectedTableId)

    const handleEditData = async (d: any) => {
        dispatch({ type: "openLayers/setEditColumn", payload: true });
        dispatch({ type: "openLayers/setSelectedColumnId", payload: d.id });
        dispatch({
            type: "datasetTable/setUserInputColumnValues",
            payload: tableColumns,
        });
        tableColumns.forEach((elem: any) => {
            dispatch({
                type: "datasetTable/updateUserInputColumnValuesWithName",
                payload: {
                    name: elem.name,
                    value: d[elem.name.toLowerCase().replaceAll(" ", "_")],
                },
            });
        });
    };

    const handleDeleteData = async(d: any) => {
        const deleteUserTableIdColumn = await removeDataFromUserTablesId(d.id, selectedTableId);
        dispatch({ type: 'datasetTableView/setDeleteData', payload: false })
        dispatch({ type: 'datasetTableView/setGetUpdateFromDatabase', payload: true })
    }
    return (
        <TableContainer overflowY={"auto"} maxHeight={"90vh"}>
            <Table variant="striped" colorScheme="gray">
                <TableCaption>{tableName}</TableCaption>
                <Thead>
                    <Tr>
                        {(editData || deleteData) && <Th>Action</Th>}
                        {selectedTable !== null &&
                            selectedTable.columns_in_table.RawMessage !== null &&
                            selectedTable.columns_in_table.RawMessage.map((c: any) => {
                                return <Th>{c.name}</Th>;
                            })}
                        {/* <Th isNumeric>multiply by</Th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {data !== null &&
                        data.error === undefined &&
                        data.map((d: any) => {
                            return (
                                <Tr>
                                    {(editData || deleteData) && (
                                        <Td textAlign="right">
                                            <HStack paddingRight={"20px"}>
                                                {editData && (
                                                    <IconButton
                                                        aria-label={`edit`}
                                                        icon={<MdModeEdit />}
                                                        size="sm"
                                                        colorScheme="blue"
                                                        variant="outline"
                                                        onClick={() => handleEditData(d)}
                                                    />
                                                )}
                                                {deleteData && (
                                                    <IconButton
                                                        aria-label={`delete`}
                                                        icon={<MdDeleteForever />}
                                                        size="sm"
                                                        colorScheme="green"
                                                        variant="outline"
                                                        onClick={() => handleDeleteData(d)}
                                                    />
                                                )}
                                                <IconButton
                                                    aria-label={`cancel`}
                                                    icon={<MdCancel />}
                                                    size="sm"
                                                    colorScheme="red"
                                                    variant="outline"
                                                    onClick={() => {
                                                        dispatch({
                                                            type: "datasetTableView/setEditData",
                                                            payload: false,
                                                        });
                                                        dispatch({
                                                            type: "datasetTableView/setDeleteData",
                                                            payload: false,
                                                        });
                                                    }}
                                                />
                                            </HStack>
                                        </Td>
                                    )}
                                    {selectedTable !== null &&
                                        selectedTable?.columns_in_table?.RawMessage.map(
                                            (t: any) => {
                                                const field = t.name.toLowerCase().replaceAll(" ", "_");
                                                return (
                                                    <Td overflowY={"clip"} maxHeight={"50px"}>
                                                        {t.type === "timestamp"
                                                            ? readableTimestamp(d[field])
                                                            : t.type === "image"
                                                                ? d[field] !== "" && (
                                                                    <ImageView url={d[field]} />
                                                                )
                                                                : d[field]}
                                                    </Td>
                                                );
                                            },
                                        )}
                                </Tr>
                            );
                        })}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default Tables;