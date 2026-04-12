import React, { useState } from 'react';
import {
    Button,
    Box,
    HStack,
    VStack
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import UserTable from './UserTable';

const Datasets = () => {
    const [addFormat, setAddFormat] = useState<boolean>(false);
    return (
        <>
            <Button backgroundColor='#EDB458' onClick={() => {
                setAddFormat(true)
            }}>
                Füge ein neue Datenbankformat hinzu
            </Button>
            {addFormat && <UserTable/>}
        </>
    );
}

export default Datasets;