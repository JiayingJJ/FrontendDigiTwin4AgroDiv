import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button, Radio, RadioGroup, Stack, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Heading,
    Text,
    Checkbox, CheckboxGroup
} from '@chakra-ui/react'
import Tables from './Tables';
import { getReport } from '../../api/report';
const SelectColumn = () => {
    const dispatch = useDispatch()
    const selected = useSelector((state: any) => state.datasetTableView.selectedTable)
    const redernSelectColumn = useSelector((state: any) => state.datasetTableView.redernSelectColumn)
    const selectedTable = useSelector((state: any) => state.datasetTableView.selectedTable)
    const selecedColumns = useSelector((state: any) => state.datasetTableView.selecedColumns)
    const allColumnsName = useSelector((state: any) => state.datasetTableView.allColumnsName)

    const handleOnClose = () => {
        dispatch({ type: 'datasetTableView/setRedernSelectColumn', payload: false })
    }

    const handleOnChange = (e: any) => {
        dispatch({ type: 'datasetTableView/addSelectedColumns', payload: e })
    }
    const handleDownload = async () => {
        const notSelectedColumns = allColumnsName.filter((n: string) => !selecedColumns.includes(n))
        const data = await getReport(selectedTable.id, notSelectedColumns)
        dispatch({ type: 'datasetTableView/setSelecedColumns', payload: [] })
        dispatch({ type: 'datasetTableView/setRedernSelectColumn', payload: false })
    }
    return (
        <Modal isOpen={redernSelectColumn} onClose={handleOnClose} size={'lg'} >
            <ModalOverlay />
            <ModalContent maxHeight="80vh">
                <ModalHeader>Select Columns For Download</ModalHeader>
                <ModalCloseButton />
                <ModalBody overflowY={"auto"}>
                    <VStack style={{ display: "flex", alignItems: "start" }}>
                        <Heading size="md">{selected?.table_name}</Heading>
                        {selectedTable !== null && selectedTable.columns_in_table.RawMessage !== null && selectedTable.columns_in_table.RawMessage.map((c: any) => {
                            return (
                                <Text fontSize='2xl'><Checkbox key={c.name}
                                    isChecked={selecedColumns.includes(c.name)}
                                    onChange={() => handleOnChange(c.name)} value={c.name}>{c.name}</Checkbox></Text>
                            )
                        })}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleOnClose}>
                        Close
                    </Button>
                    <Button variant='ghost' onClick={() => handleDownload()}>Download</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    );
}

export default SelectColumn;