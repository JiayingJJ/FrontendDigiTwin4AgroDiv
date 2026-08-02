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
    id: string,
    additionalInfo: []
}
const SelectComponent = ({ name, hint, id, additionalInfo }: Props) => {
    const dispatch = useDispatch()
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })

    };
    return (
        <FormControl key={`${id}-select-comp-form`}>
            <FormLabel>{name}</FormLabel>
            <Select placeholder='auswählen' onChange={handleChange} key={`${id}-select-comp-form-selec`}>
                {additionalInfo.options.map((o: string) => {
                    return (<option key={`${o}-select-comp-form-value`}>{o}</option>)
                })}
            </Select>
        </FormControl>
    );
}

export default SelectComponent;