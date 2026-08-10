import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import { readableTimestamp } from '../../helpers';
import ImageView from './ImageView';
function Tables() {
    const columns = useSelector((state: any) => state.datasetTableView.columns)
    const data = useSelector((state: any) => state.datasetTableView.data)
    const tableName = useSelector((state: any) => state.datasetTableView.tableName)
    const tableID = useSelector((state: any) => state.datasetTableView.tableID)
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)
    const [showImage, setShowImage] = useState<boolean>(false)
    return (
        <TableContainer overflowY={"auto"} maxHeight={"90vh"}>
            <Table variant='striped' colorScheme='gray'>
                <TableCaption>{tableName}</TableCaption>
                <Thead>
                    <Tr>
                        {selectedTable !== null && selectedTable.columns_in_table.RawMessage !== null && selectedTable.columns_in_table.RawMessage.map((c: any) => {
                            return (
                                <Th>{c.name}</Th>
                            )
                        })}
                        {/* <Th isNumeric>multiply by</Th> */}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.error === undefined && data.map((d: any) => {
                        return (<Tr>
                            {
                                selectedTable !== null && selectedTable?.columns_in_table?.RawMessage.map((t: any) => {
                                    const field = t.name.toLowerCase().replaceAll(" ", "_");
                                    return (
                                        <Td>{t.type === "timestamp" ? readableTimestamp(d[field]) : t.type === "image" ?

                                            d[field] !== "" && <ImageView url={d[field]} />
                                            : d[field]}</Td>
                                    )
                                })
                            }
                        </Tr>)
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default Tables;