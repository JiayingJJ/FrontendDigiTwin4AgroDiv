
import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, Input, Button, Box, } from '@chakra-ui/react'
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { PostUser } from '../api/user';

const Register = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [valueName, setValueName] = useState<string>('')
    const [valueEmail, setValueEmail] = useState<string>('')
    const [disabledRegister, setDisabledRegister] = useState<boolean>(true);
    useEffect(() => {
        if (valueEmail !== "" && valueName !== "") {
            setDisabledRegister(false)
        } else {
            setDisabledRegister(true)
        }
    }, [valueEmail, valueName])
    const createUser = async () => {
        const data = await PostUser(valueName, valueEmail);
        dispatch({ type: 'user.setName', valueName })
        if (data[1] === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: data[0].error })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            dispatch({ type: 'user/setUserId', payload: data[0].ID })
            dispatch({ type: 'user/setName', payload: data[0].Name })
            dispatch({ type: 'user/setEmail', payload: data[0].Email })
            navigate("/")
        }
    }
    const handleChange = (event: any, value: string) => {
        if (value === "email") {
            setValueEmail(event.target.value)
        } else if (value === "name") {
            setValueName(event.target.value)
        }
    }
    return (
        <VStack display="flex" justifyContent="center" height={"100%"}>
            <Input width="400px" borderColor="#60935D" placeholder='Username' value={valueName}
                onChange={(e) => handleChange(e, "name")} />
            <Input width="400px" borderColor="#60935D" placeholder='Email' outline={""} value={valueEmail}
                onChange={(e) => handleChange(e, "email")} />
            <Button width="400px" disabled={disabledRegister} rightIcon={<IoIosLogIn />} backgroundColor={"#E8871E"} color="white" onClick={createUser}>
                Register
            </Button>
        </VStack>
    );
}

export default Register;