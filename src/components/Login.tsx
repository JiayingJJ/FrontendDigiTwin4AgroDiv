import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { VStack, Input, Button, } from '@chakra-ui/react'
import { RiAdminLine } from "react-icons/ri";
const Login = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [value, setValue] = useState<string>('')
    
    const handleChange = (event: any) => setValue(event.target.value)
    const createUser = async() => {
        const data = await fetch(`${apiUrl}/users`, {
            method: "POST",
            body: JSON.stringify({ name: value }),
        })
        console.log(data)
    }
    return (
        <VStack>
            <Input placeholder='Username' value={value}
        onChange={handleChange}/>
            <Button rightIcon={<RiAdminLine />} colorScheme='teal' variant='outline' onClick={createUser}>
                Create User
            </Button>
        </VStack>

    );
}

export default Login;