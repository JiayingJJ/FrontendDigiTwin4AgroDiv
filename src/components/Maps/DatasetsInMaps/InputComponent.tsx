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
import { getCurrentTime } from '../../../helpers';
type Props = {
    name: string,
    hint: number,
    id: string,
    type: string
}
const InputComponent = ({ name, hint, id, type }: Props) => {
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    useEffect(() => {
        if (type === "timestamp") {
            setLabelName(getCurrentTime())
            dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: getCurrentTime() } })
        }
    }, [])
    return (
        <FormControl onMouseOver={() => { console.log() }}>
            <Text mb='8px'>{name}</Text>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    {type === "timestamp" ? <Input placeholder={`${hint}`} value={labelName} onChange={(e) => {
                        console.log(id)
                        console.log(e.target.value)
                        setLabelName(e.target.value)
                        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })
                    }} /> : <Input placeholder={`${hint}`} value={labelName} onChange={(e) => {
                        console.log(id)
                        setLabelName(e.target.value)
                        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })
                    }} />}

                </Box>
            </Box>

        </FormControl>
    );
}

export default InputComponent;