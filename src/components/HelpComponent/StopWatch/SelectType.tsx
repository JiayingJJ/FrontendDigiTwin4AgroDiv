import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HStack, Button, VStack } from '@chakra-ui/react'
import StopWatch from './StopWatch';
import TimerComponent from './TimerComponent';
const SelectType = () => {
    const dispatch = useDispatch()
    const watchType = useSelector((state: any) => state.helpComponent.watchType)
    return (
        <VStack>
            <HStack direction='row' spacing={4} align='center'>
                <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'helpComponent/setWatchType', payload: "timer" })}>Timer</Button>
                <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'helpComponent/setWatchType', payload: "stopwatch" })}>Stoppuhr</Button>
            </HStack>
            {watchType === "stopwatch" && <StopWatch />}
            {watchType === "timer" && <TimerComponent />}
        </VStack>
    );
}

export default SelectType;