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
    Select
} from '@chakra-ui/react'
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { MdOutlineAdd } from "react-icons/md";
type Props = {
    id: string,
    index: number,
    data: any,
}
const SelectComponent = ({ id, index, data }: Props) => {
    console.log(data)
    const [labelName, setLabelName] = useState<string>("");
    const [optionName, setOptionName] = useState<string>("");
    const [labelInfo, setLabelInfo] = useState<string>("");

    const [optionsState, setOptionsState] = useState([])
    const dispatch = useDispatch()
    const [isDisabled, setIsDisabled] = useState<boolean>(true);
    const [isDisabledAddBtn, setIsDisabledAddBtn] = useState<boolean>(true);

    useEffect(() => {
        if (data.name !== '') {
            setLabelName(data.name)
            setLabelInfo(data.hint)
            setOptionsState(data.additional_info.options)
        }
    }, [])
    return (
        <FormControl backgroundColor={"red.200"} padding={"8px"} marginTop={"5px"}>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    <FormLabel>Geben Sie bitte ein Name für das Select</FormLabel>
                    <Input placeholder='Component name' value={labelName} onChange={(e) => {
                        if (e.target.value !== "" && optionsState.length !== 0) {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        setLabelName(e.target.value)
                    }} />
                    <FormLabel>Geben Sie bitte ein Hintinfo</FormLabel>
                    <Input placeholder='Component name' value={labelInfo} onChange={(e) => {
                        setLabelInfo(e.target.value)
                    }} />
                    <FormLabel>Geben Sie bitte die Value für das Select</FormLabel>
                    <Box style={{ display: "flex", flexDirection: "row" }}>
                        <Input placeholder='Select Values' value={optionName} onChange={(e) => {
                            if (e.target.value !== "") {
                                setIsDisabledAddBtn(false)
                            } else {
                                setIsDisabledAddBtn(true)
                            }
                            setOptionName(e.target.value)
                        }} />
                        <MdOutlineAdd color="green" cursor={isDisabledAddBtn ? "not-allowed" : "pointer"} size="40" onClick={() => {
                            const exist = optionsState.filter((o) => o === optionName)
                            if (exist.length === 0) {
                                setOptionsState([...optionsState, optionName])
                                setIsDisabled(false)
                            } else {
                                dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
                                dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
                                dispatch({ type: 'alertInfo/setAlertMessage', payload: "Value wurde schon erstellt" })
                                dispatch({ type: 'alertInfo/setShowAlert', payload: true })
                            }
                            setOptionName("")
                        }} />
                    </Box>
                    <Select placeholder='auswählen'>
                        {optionsState.map((e) => {
                            return (
                                <option>{e}</option>
                            )
                        })}
                    </Select>
                </Box>
                <Button disabled={isDisabled} style={{ paddingRight: "0px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CiCircleCheck color="green" cursor={isDisabled ? "not-allowed" : "pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/updateUserTableColumns', payload: { id: id, name: labelName, type: "select", position: index, hint: labelInfo, additional_info: { "options": optionsState, "default": optionsState[0] } } })
                    }} />
                </Button>
                <Button style={{ paddingRight: "0px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CiCircleRemove color="green" cursor={"pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/removeUserTableColumn', payload: id })
                    }} />
                </Button>
            </Box>
        </FormControl>
    );
}

export default SelectComponent;