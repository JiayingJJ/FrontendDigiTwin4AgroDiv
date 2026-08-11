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
    Text,
    Stack
} from '@chakra-ui/react'
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
type Props = {
    id: string,
    index: number,
    data: any,
}
const TextComponent = ({ id, index, data }: Props) => {
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    const [labelInfo, setLabelInfo] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [value, setValue] = useState(data.type)
    const [valueNumber, setValueNumber] = useState(data.type)

    const tableColumns = useSelector((state: any) => state.datasetTable.tableColumns)

    useEffect(() => {
        if (data.name !== '') {
            setLabelName(data.name)
            setLabelInfo(data.hint)
        }
    }, [])

    return (
        <FormControl onMouseOver={() => { }} padding={"8px"} marginTop={"5px"}>
            <FormLabel>Geben Sie bitte ein Name für das Input</FormLabel>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    <Input placeholder='Component name' value={labelName} onChange={(e) => {
                        if (e.target.value !== "") {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        setLabelName(e.target.value)
                        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: id })
                    }} />
                    <FormLabel>Geben Sie bitte ein Hintinfo</FormLabel>
                    <Input placeholder='Component hint' value={labelInfo} onChange={(e) => {
                        if (e.target.value !== "") {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        setLabelInfo(e.target.value)
                        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: id })
                    }} />
                    {!tableColumns.some((tc: any) => tc.id === id) && <FormLabel>Wählen Sie ein Datentyp aus</FormLabel>}
                    {!tableColumns.some((tc: any) => tc.id === id) && <RadioGroup onChange={(e) => {
                        if (e) {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        setValue(e)
                        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: id })
                    }} defaultValue={"text"}>
                        <Stack direction='row'>
                            <Radio value='text'>Text</Radio>
                            <Radio value='timestamp'>Datum</Radio>
                            <Radio value='number'>Number</Radio>
                        </Stack>
                    </RadioGroup>}
                    {value === 'number' && <RadioGroup onChange={(e) => {
                        if (e) {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        setValueNumber(e)
                        dispatch({ type: 'datasetTable/addIsChangingColumns', payload: id })
                    }} value={valueNumber}>
                        <Stack direction='row'>
                            <Radio value='integer'>Ganzzahl</Radio>
                            <Radio value='real'>Dezimalzahl</Radio>
                        </Stack>
                    </RadioGroup>}
                </Box>
                <Button disabled={isDisabled} style={{ paddingRight: "0px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CiCircleCheck color="green" cursor={isDisabled ? "not-allowed" : "pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/updateUserTableColumns', payload: { id: id, name: labelName, type: `${value === 'number' ? valueNumber : value}`, position: index, hint: labelInfo, additional_info: [] } })
                        dispatch({ type: 'datasetTable/removeIsChangingColumns', payload: id })
                        setIsDisabled(true)
                    }} />
                </Button>
                <Button style={{ paddingRight: "0px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CiCircleRemove color="green" cursor={"pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/removeUserTableColumn', payload: id })
                        dispatch({ type: 'datasetTable/removeNewColumn', payload: id })
                        dispatch({ type: 'datasetTable/removeIsChangingColumns', payload: id })
                    }} />
                </Button>
            </Box>

        </FormControl>
    );
}

export default TextComponent;