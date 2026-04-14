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
type Props = {
    id: string,
    index: number
}
const SelectComponent = ({ id, index }: Props) => {
    const [labelName, setLabelName] = useState<string>("");

    return (
        <FormControl onMouseOver={() => {console.log(index)}}>
            <FormLabel>{labelName}</FormLabel>
            <Input placeholder='Component name' value={labelName} onChange={(e) => {
                setLabelName(e.target.value)
            }} />
            <Select placeholder='auswählen'>
                <option>Winter</option>
                <option>Frühling</option>
                <option>Sommer</option>
                <option>Herbst</option>
            </Select>
        </FormControl>
    );
}

export default SelectComponent;