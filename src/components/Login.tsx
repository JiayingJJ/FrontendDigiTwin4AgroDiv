import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, Input, Button, Box, } from '@chakra-ui/react'
import { IoIosLogIn } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { fetchUserWithEmail } from '../api/user';
import { databaseSqlite } from './sqlite/db';
const Login = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

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
    const validData = (id: string, name: string, email: string) => {
        dispatch({ type: 'user/setIsAuthenticated', payload: true })
        dispatch({ type: 'user/setUserId', payload: id })
        dispatch({ type: 'user/setName', payload: name })
        dispatch({ type: 'user/setEmail', payload: email })
        navigate("/dashboard")
    }

    const setAlert = (status: string, title: string, msg: string, show: boolean) => {
        dispatch({ type: 'alertInfo/setAlertStatus', payload: status })
        dispatch({ type: 'alertInfo/setAlertTitle', payload: title })
        dispatch({ type: 'alertInfo/setAlertMessage', payload: msg })
        dispatch({ type: 'alertInfo/setShowAlert', payload: show })
    }
    const getUserWithEmail = async () => {
        if (isOnLine) {
            const data = await fetchUserWithEmail(valueEmail);
            if (data[1] !== 200) {
                setAlert('error', "Error Message", "Bitte valide Informationen geben.", true)
            } else {
                validData(data[0].ID, data[0].Name, data[0].Email)
            }
        } else {
            await databaseSqlite.initDb();
            const data = await databaseSqlite.getUserWithEmail(valueEmail);
            if (data !== null) {
                validData(data.id, data.name, data.email)
            } else {
                setAlert('error', "Error Message", "Bitte valide Informationen geben.", true)
            }
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