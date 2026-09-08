import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Button,
    VStack
} from '@chakra-ui/react'
import SelectType from "./StopWatch/SelectType";
const Helps = () => {
    const dispatch = useDispatch()
    const rendernHelpComponent = useSelector((state: any) => state.helpComponent.rendernHelpComponent)

    return (
        <VStack style={{ display: "flex", flexDirection: "column", alignItems: "baseline" }}>
            <Button onClick={() =>
                dispatch({ type: 'helpComponent/setRendernHelpComponent', payload: !rendernHelpComponent })
            }>{rendernHelpComponent ? "Close Help" : "Select a Help"}</Button>
            {rendernHelpComponent && <SelectType />}
        </VStack>
    );
}

export default Helps;