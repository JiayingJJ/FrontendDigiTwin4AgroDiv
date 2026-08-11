import React, { useEffect, useState, useMemo } from 'react';
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Text
} from '@chakra-ui/react'
type Props = {
    name: string,
    hint: number,
    id: string,
    type: string
}
const InputComponent = ({ name, hint, id, type }: Props) => {
    const dispatch = useDispatch()
    const [labelName, setLabelName] = useState<string>("");
    const [valueNum, setValueNum] = useState("");
    const nowLocal = useMemo(() => {
        const d = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        const hh = pad(d.getHours());
        const min = pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    }, []);
    return (
        <FormControl onMouseOver={() => { console.log() }}>
            <Text mb='8px'>{name}</Text>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    {type === "timestamp" ? <Input type='datetime-local' placeholder={`${hint}`} defaultValue={nowLocal} onChange={(e) => {
                        setLabelName(e.target.value)
                        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: e.target.value } })
                    }} />
                        : type === "integer" ?
                            <NumberInput allowMouseWheel size='sm' min={-1000} step={1} value={valueNum}
                                height="100%"
                                onChange={(valueString) => {
                                    console.log(valueString)
                                    setValueNum(valueString)
                                    dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: valueString } })
                                }}>
                                <NumberInputField />
                                <NumberInputStepper height="100%">
                                    <NumberIncrementStepper
                                        bg='green.200'
                                        _active={{ bg: 'green.300' }}
                                        children='+'
                                        height="50%"
                                        lineHeight="1"
                                    />
                                    <NumberDecrementStepper
                                        bg='pink.200'
                                        _active={{ bg: 'pink.300' }}
                                        children='-'
                                        height="50%"
                                        lineHeight="1"
                                    />
                                </NumberInputStepper>
                            </NumberInput>
                            : type === "real" ?
                                <NumberInput allowMouseWheel size='sm' min={-1000} precision={2} step={0.1} value={valueNum}
                                    height="100%"
                                    onChange={(valueString) => {
                                        setValueNum(valueString)
                                        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: valueString } })
                                    }}>
                                    <NumberInputField />
                                    <NumberInputStepper height="100%">
                                        <NumberIncrementStepper
                                            bg='green.200'
                                            _active={{ bg: 'green.300' }}
                                            children='+'
                                            height="50%"
                                            lineHeight="1"
                                        />
                                        <NumberDecrementStepper
                                            bg='pink.200'
                                            _active={{ bg: 'pink.300' }}
                                            children='-'
                                            height="50%"
                                            lineHeight="1"
                                        />
                                    </NumberInputStepper>
                                </NumberInput>
                                : <Input placeholder={`${hint}`} value={labelName} onChange={(e) => {
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