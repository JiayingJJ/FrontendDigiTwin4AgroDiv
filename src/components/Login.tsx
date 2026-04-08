import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, Input, Button, Box, } from '@chakra-ui/react'
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [valueName, setValueName] = useState<string>('')
    const [valueEmail, setValueEmail] = useState<string>('')

    const handleChange = (event: any, value: string) => {
        if (value === "email") {
            setValueEmail(event.target.value)
        } else if (value === "name") {
            setValueName(event.target.value)
        }
    }
    const createUser = async () => {
        const response = await fetch(`${apiUrl}/users`, {
            method: "POST",
            body: JSON.stringify({ name: valueName, email: valueEmail }),
        })
        dispatch({ type: 'user.setName', valueName })
        const data = await response.json();
        if (response.status === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: data.error })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            dispatch({ type: 'user/setName', payload: data.Name })
            dispatch({ type: 'user/setEmail', payload: data.Email })
            navigate("/dashboard")
        }
    }
    return (
        <VStack display="flex" justifyContent="center" height={"100%"}>
            <Input width="400px" borderColor="#60935D" placeholder='Username' value={valueName}
                onChange={(e) => handleChange(e, "name")} />
            <Input width="400px" borderColor="#60935D" placeholder='Email' outline={""} value={valueEmail}
                onChange={(e) => handleChange(e, "email")} />
            <Button width="400px" rightIcon={<IoIosLogIn />} backgroundColor={"#E8871E"} color="white" onClick={createUser}>
                Sign Up
            </Button>
        </VStack>

    );
}

export default Login;