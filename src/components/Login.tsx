import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, Input, Button, Box, } from '@chakra-ui/react'
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { fetchUserWithEmail } from '../api/user';

const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const [valueName, setValueName] = useState<string>('')
    const [valueEmail, setValueEmail] = useState<string>('')
    const [disabledLogin, setDisabledLogin] = useState<boolean>(true);
    const handleChange = (event: any, value: string) => {
        if (value === "email") {
            setValueEmail(event.target.value)
        } else if (value === "name") {
            setValueName(event.target.value)
        }
    }
    useEffect(() => {
        if (valueEmail === "") {
            setDisabledLogin(true)
        } else {
            setDisabledLogin(false)
        }
    }, [valueEmail])

    const getUserWithEmail = async () => {
        const data = await fetchUserWithEmail(valueEmail);
        console.log(data)
        if (data[1] !== 200) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte valide Informationen geben." })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            dispatch({ type: 'user/setIsAuthenticated', payload: true })
            dispatch({ type: 'user/setUserId', payload: data[0].ID })
            dispatch({ type: 'user/setName', payload: data[0].Name })
            dispatch({ type: 'user/setEmail', payload: data[0].Email })
            navigate("/dashboard")
        }
    }
    return (
        <VStack display="flex" justifyContent="center" height={"100%"}>
            {/* <Input width="400px" borderColor="#60935D" placeholder='Username' value={valueName}
                onChange={(e) => handleChange(e, "name")} /> */}
            <Input width="400px" borderColor="#60935D" placeholder='Email' outline={""} value={valueEmail}
                onChange={(e) => handleChange(e, "email")} />
            <Button width="400px" disabled={disabledLogin} rightIcon={<IoIosLogIn />} backgroundColor={"#E8871E"} color="white" onClick={getUserWithEmail}>
                Log in
            </Button>
            <Button colorScheme='teal' variant='ghost' onClick={() => navigate("/register")
            }>
                Registieren ein neue Account
            </Button>
        </VStack>

    );
}

export default Login;