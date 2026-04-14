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
    index: number
}
const TextComponent = ({id, index }: Props) => {
    console.log(index)
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    return (
        <FormControl onMouseOver={() => {console.log(index)}}>
            <Text mb='8px'>Geben Sie bitte ein Name für das Input {id}</Text>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Input placeholder='Component name' value={labelName} onChange={(e) => {
                    if (e.target.value !== "") {
                        setIsDisabled(false)
                    } else {
                        setIsDisabled(true)
                    }
                    console.log(e.target.value)
                    setLabelName(e.target.value)
                }} />
                <Button disabled={isDisabled} style={{ padding: "5px", margin: "5px", backgroundColor: "transparent" }}>
                    <CiCircleCheck color="green" cursor={isDisabled ? "not-allowed" : "pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/updateUserTableColumns', payload: { id: id, name: labelName, type: "text", position: index } })
                    }} />

                    <CiCircleRemove color="green" cursor={isDisabled ? "not-allowed" : "pointer"} size="40" onClick={() => {
                        dispatch({ type: 'datasetTable/removeUserTableColumn', payload: id })
                    }} />
                </Button>
            </Box>
        </FormControl>
    );
}

export default TextComponent;