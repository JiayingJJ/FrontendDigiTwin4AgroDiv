import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
function Tables() {
    const columns = useSelector((state: any) => state.datasetTableView.columns)
    const data = useSelector((state: any) => state.datasetTableView.data)
    const tableName = useSelector((state: any) => state.datasetTableView.tableName)
    return (
        <TableContainer>
            <Table variant='striped' colorScheme='gray'>
                <TableCaption>{tableName}</TableCaption>
                <Thead>
                    <Tr>
                        {columns.map((c: any) => {
                            return (
                                <Th>{c.name}</Th>
                            )
                        })}
                        {/* <Th isNumeric>multiply by</Th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((d: any, rowIndex: number) => (
                        <Tr key={rowIndex}>
                            {columns.map((c: any, colIndex: number) => {
                                const lowerCaseName = c.name.toLowerCase();
                                const varName = lowerCaseName.replaceAll(" ", "_");
                                const value = d[varName];
                                return (
                                    <Td key={colIndex}>{value}</Td>
                                );
                            })}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default Tables;