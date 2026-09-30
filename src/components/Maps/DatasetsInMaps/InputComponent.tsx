import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Box,
    FormControl,
    Input,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Heading,
} from "@chakra-ui/react";
import { FaPlus, FaMinus } from "react-icons/fa";
type Props = {
    name: string;
    hint: number;
    id: string;
    type: string;
};
const InputComponent = ({ name, hint, id, type }: Props) => {
    const dispatch = useDispatch();
    const [labelName, setLabelName] = useState<string>("");
    const [valueNum, setValueNum] = useState("");
    const editColumn = useSelector((state: any) => state.openLayers.editColumn)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)

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
    useEffect(() => {
        if (editColumn) {
            const data = userInputColumnValues.filter((i: any) => i.id === id);
            if (data[0].value !== null) {
                if (type === "integer" || type === "real") {
                    if (data[0].value !== "number_as_null") {
                        setValueNum(data[0].value);
                    } else {
                        setValueNum("0");
                    }
                } else if (type === "timestamp") {
                    const result = data[0].value.slice(0, 16);
                    setLabelName(result);
                } else {
                    setLabelName(data[0].value);
                }
            }
        } else {
            if (type === "timestamp") {
                dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: nowLocal } })
            } else if (type === "integer" || type === "real") {
                dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: "number_as_null" } })
            }
        }
    }, [])
    return (
        <FormControl onMouseOver={() => {console.log();}}>
            <Heading as="h4" size="md" padding={"15px 0px 10px 0px"}>{name}</Heading>
            <Box
                style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
            >
                <Box style={{ display: "flex", flexDirection: "column" }}>
                    {type === "timestamp" ? (
                        <Input
                            type="datetime-local"
                            placeholder={`${hint}`}
                            defaultValue={editColumn ? labelName : nowLocal}
                            onChange={(e) => {
                                setLabelName(e.target.value);
                                dispatch({
                                    type: "datasetTable/updateUserInputColumnValues",
                                    payload: { id: id, value: e.target.value }
                                });
                            }}
                        />
                    ) : type === "integer" ? (
                        <NumberInput
                            allowMouseWheel
                            size={"lg"}
                            min={-1000}
                            step={1}
                            height="100%"
                            value={valueNum}
                            onChange={(valueString) => {
                                console.log(valueString);
                                setValueNum(valueString);
                                dispatch({
                                    type: "datasetTable/updateUserInputColumnValues",
                                    payload: { id: id, value: valueString }
                                });
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper height="100%">
                                <NumberIncrementStepper
                                    bg="green.200"
                                    _active={{ bg: "green.300" }}
                                    height="50%"
                                    lineHeight="1"
                                >
                                    <FaPlus />
                                </NumberIncrementStepper>
                                <NumberDecrementStepper
                                    bg="pink.200"
                                    _active={{ bg: "pink.300" }}
                                    height="50%"
                                    lineHeight="1"
                                >
                                    <FaMinus />
                                </NumberDecrementStepper>
                            </NumberInputStepper>
                        </NumberInput>
                    ) : type === "real" ? (
                        <NumberInput
                            allowMouseWheel
                            min={-1000}
                            precision={2}
                            step={0.1}
                            value={valueNum}
                            height="100%"
                            size={"lg"}
                            onChange={(valueString) => {
                                setValueNum(valueString);
                                dispatch({
                                    type: "datasetTable/updateUserInputColumnValues",
                                    payload: { id: id, value: valueString },
                                });
                            }}
                        >
                            <NumberInputField />
                            <NumberInputStepper height="100%">
                                <NumberIncrementStepper
                                    bg="green.200"
                                    _active={{ bg: "green.300" }}
                                    height="50%"
                                    lineHeight="1"
                                >
                                    <FaPlus />
                                </NumberIncrementStepper>
                                <NumberDecrementStepper
                                    bg="pink.200"
                                    _active={{ bg: "pink.300" }}
                                    height="50%"
                                    lineHeight="1"
                                >
                                    <FaMinus />
                                </NumberDecrementStepper>
                            </NumberInputStepper>
                        </NumberInput>
                    ) : (
                        <Input
                            placeholder={`${hint}`}
                            defaultValue={labelName}
                            size={"lg"}
                            onChange={(e) => {
                                console.log(id);
                                setLabelName(e.target.value);
                                dispatch({
                                    type: "datasetTable/updateUserInputColumnValues",
                                    payload: { id: id, value: e.target.value },
                                });
                            }}
                        />
                    )}
                </Box>
            </Box>
        </FormControl>
    );
}

export default InputComponent;