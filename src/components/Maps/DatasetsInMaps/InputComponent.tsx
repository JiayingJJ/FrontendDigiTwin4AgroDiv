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
type Props = {
    name: string,
    hint: number,
    id: string
}
const InputComponent = ({ name, hint, id }: Props) => {
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    return (
        <FormControl onMouseOver={() => { console.log() }}>
            <Text mb='8px'>{name}</Text>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    <Input placeholder={`${hint}`} value={labelName} onChange={(e) => {
                        console.log(id)
                        setLabelName(e.target.value)
                        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })
                    }} />
                </Box>
            </Box>

        </FormControl>
    );
}

export default InputComponent;