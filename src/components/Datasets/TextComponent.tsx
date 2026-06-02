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
    Text
} from '@chakra-ui/react'
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
type Props = {
    id: string,
    index: number,
    data: any
}
const TextComponent = ({ id, index, data }: Props) => {
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    const [labelInfo, setLabelInfo] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (data.name !== '') {
            setLabelName(data.name)
            setLabelInfo(data.hint)
        }
    }, [])
    return (
        <FormControl onMouseOver={() => { }} backgroundColor={"red.200"} padding={"8px"} marginTop={"5px"}>
            <FormLabel>Geben Sie bitte ein Name für das Input</FormLabel>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    <Input placeholder='Component name' value={labelName} onChange={(e) => {
                        if (e.target.value !== "") {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        console.log(e.target.value)
                        setLabelName(e.target.value)
                    }} />
                    <FormLabel>Geben Sie bitte ein Hintinfo</FormLabel>
                    <Input placeholder='Component hint' value={labelInfo} onChange={(e) => {
                        if (e.target.value !== "") {
                            setIsDisabled(false)
                        } else {
                            setIsDisabled(true)
                        }
                        console.log(e.target.value)
                        setLabelInfo(e.target.value)
                    }} />
                </Box>
                <Button disabled={isDisabled} style={{ paddingRight: "0px", backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CiCircleCheck color="green" cursor={isDisabled ? "not-allowed" : "pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/updateUserTableColumns', payload: { id: id, name: labelName, type: "text", position: index, hint: labelInfo, additional_info: [] } })
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

export default TextComponent;