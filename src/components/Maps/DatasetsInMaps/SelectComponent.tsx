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
    const editColumn = useSelector((state: any) => state.openLayers.editColumn)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)
    const [selectedValue, setSelectedValue] = useState("");
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(e.target.value)
        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })

    };
    useEffect(() => {
        if (editColumn) {
            const data = userInputColumnValues.filter((i: any) => i.id === id)
            setSelectedValue(data[0].value)
        }
    }, [])
    return (
        <FormControl key={`${id}-select-comp-form`}>
            <FormLabel>{name}</FormLabel>
            <Select placeholder='auswählen' value={selectedValue} onChange={handleChange} key={`${id}-select-comp-form-selec`}>
                {additionalInfo.options.map((o: string) => {
                    return (<option key={`${o}-select-comp-form-value`}>{o}</option>)
                })}
            </Select>
        </FormControl>
    );
}

export default SelectComponent;