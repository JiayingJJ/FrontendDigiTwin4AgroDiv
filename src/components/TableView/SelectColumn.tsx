import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button, Radio, RadioGroup, HStack, Modal, ModalOverlay,
    ModalContent, ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Heading,
    Text, Checkbox, FormHelperText,
    FormControl, FormLabel,
} from '@chakra-ui/react'
import Tables from './Tables';
import { getReport } from '../../api/report';
const SelectColumn = () => {
    const dispatch = useDispatch()
    const selected = useSelector((state: any) => state.datasetTableView.selectedTable)
    const dataInRedux = useSelector((state: any) => state.datasetTableView.data)
    const [addGeoInfo, setAddGeoInfo] = useState<string>("geo_data")

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
        let formatedColumns: any = [];
        notSelectedColumns.map((v: any) => {
            let string = v.replace(/[^a-zA-Z0-9]/g, '_');
            formatedColumns.push(string.toLowerCase())
        })
        const data = await getReport(selectedTable.id, formatedColumns, addGeoInfo)
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
                        <FormControl as='fieldset'>
                            <FormLabel as='legend'>Add Geo Info</FormLabel>
                            <RadioGroup defaultValue={addGeoInfo} onChange={setAddGeoInfo}>
                                <HStack spacing='24px'>
                                    <Radio value='geo_data'>Ja</Radio>
                                    <Radio value='without_geo_data'>Nein</Radio>
                                </HStack>
                            </RadioGroup>
                            <FormHelperText>Select only if you need geo info for download</FormHelperText>
                        </FormControl>
                        {allColumnsName !== null && allColumnsName.map((c: any) => {
                            return (
                                <Text fontSize='2xl'><Checkbox key={c}
                                    isChecked={selecedColumns.includes(c)}
                                    onChange={() => handleOnChange(c)} value={c}>{c}</Checkbox></Text>
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