import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    VStack, HStack, IconButton, Heading, Button, Text
} from '@chakra-ui/react'
import { FaPlay, FaStop } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
const TimerComponent = () => {
    const dispatch = useDispatch()
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isStopping, setIsStopping] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);

    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);
    const restTimeRef = useRef(0);

    useEffect(() => {
        if (restTimeRef.current === 0) {
            handleReset()
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: null })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Time's up" })
            return () =>
                clearInterval(intervalIdRef.current)
        }
        if (isRunning && !isStopping) {
            intervalIdRef.current = setInterval(() => {
                restTimeRef.current = restTimeRef.current - 1;
                setStartTime(restTimeRef.current)
            }, 1000)
        }
        if (isStopping) {
            setStartTime(restTimeRef.current)
            clearInterval(intervalIdRef.current);
            setStartTime(restTimeRef.current)
        }
    }, [isRunning, isStopping])

    const handleStart = () => {
        setIsRunning(true)
        startTimeRef.current = restTimeRef.current;
    }

    const handleStop = () => {
        setIsStopping(true)
    }

    const handleReset = () => {
        setIsRunning(false)
        setIsStopping(false)

        if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }
        setStartTime(0)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
        startTimeRef.current = 0;
        restTimeRef.current = 0;
    }
    const handleGoAhead = () => {
        setIsStopping(false)
        restTimeRef.current = startTime;
    }
    const handleCalculateTime = (addOrMinus: string, index: string) => {
        if (addOrMinus === "add") {
            switch (index) {
                case "hour":
                    restTimeRef.current = restTimeRef.current + 1 * 60 * 60;
                    break;
                case "minute":
                    restTimeRef.current = restTimeRef.current + 1 * 60;
                    break;
                case "second":
                    restTimeRef.current = restTimeRef.current + 1;
                    break;
            }
        } else {
            switch (index) {
                case "hour":
                    if (hours !== 0) {
                        restTimeRef.current = restTimeRef.current - 1 * 60 * 60;
                    }
                    break;
                case "minute":
                    if (hours !== 0 || minutes !== 0) {
                        restTimeRef.current = restTimeRef.current - 1 * 60;
                    }
                    break;
                case "second":
                    if (minutes !== 0) {
                        restTimeRef.current = restTimeRef.current - 1;
                    }
                    break;
            }
        }
        setStartTime(restTimeRef.current)
        setHours(Math.floor(restTimeRef.current / (60 * 60)))
        setMinutes(Math.floor((restTimeRef.current / 60) % 60))
        setSeconds(Math.floor(restTimeRef.current % 60))
    }
    useEffect(() => {
        if (restTimeRef.current === 0) {
            handleReset()
        }
    }, [restTimeRef.current])
    const handleFormatTime = () => {
        let hoursFormat = Math.floor(restTimeRef.current / (60 * 60)).toString()
        let minutesFormat = Math.floor(restTimeRef.current / (60) % 60).toString()
        let secondsFormat = Math.floor(restTimeRef.current % 60).toString()

        hoursFormat = String(hoursFormat).padStart(2, "0");
        minutesFormat = String(minutesFormat).padStart(2, "0");
        secondsFormat = String(secondsFormat).padStart(2, "0");
        return `${hoursFormat}:${minutesFormat}:${secondsFormat}`
    }
    const handleSetTime = (min: number) => {
        restTimeRef.current = restTimeRef.current + min * 60;
        setStartTime(restTimeRef.current)
        setHours(Math.floor(restTimeRef.current / (60 * 60)))
        setMinutes(Math.floor((restTimeRef.current / 60) % 60))
        setSeconds(Math.floor(restTimeRef.current % 60))
    }
    return (
        <VStack>
            {!isRunning && <HStack>
                <VStack>
                    <Button onClick={() => {
                        handleCalculateTime("add", "hour")
                    }}>+</Button>
                    <Heading>{`${hours.toString().padStart(2, "0")}`}</Heading>
                    <Button onClick={() => {
                        handleCalculateTime("minus", "hour")
                    }}>-</Button>
                </VStack>
                <VStack>
                    <Button onClick={() => {
                        handleCalculateTime("add", "minute")
                    }}>+</Button>
                    <Heading>{`:${minutes.toString().padStart(2, "0")}`}</Heading>
                    <Button onClick={() => {
                        handleCalculateTime("minus", "minute")
                    }}>-</Button>
                </VStack>
                <VStack>
                    <Button onClick={() => {
                        handleCalculateTime("add", "second")
                    }}>+</Button>
                    <Heading>{`:${seconds.toString().padStart(2, "0")}`}</Heading>
                    <Button onClick={() => {
                        handleCalculateTime("minus", "second")
                    }}>-</Button>
                </VStack>
            </HStack>}
            {isRunning && <Heading>{handleFormatTime()}</Heading>}
            {!isRunning && <HStack>
                <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={() => {
                    handleSetTime(10);
                }}>
                    <Text>10Min</Text>
                </Button>
                <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={() => {
                    handleSetTime(15);
                }}>
                    <Text>15Min</Text>
                </Button>
                <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={() => {
                    handleSetTime(20);
                }}>
                    <Text>20Min</Text>
                </Button>
            </HStack>}
            <HStack>
                {!isRunning && <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={handleStart}>
                    <HStack display={"flex"} alignItems={"end"}>
                        <FaPlay color='#ecf39eff' />
                        <Text>Starten</Text>
                    </HStack>
                </Button>}
                {isRunning && !isStopping &&
                    <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={handleStop}>
                        <HStack display={"flex"} alignItems={"end"}>
                            <FaStop color='#ecf39eff' />
                            <Text>Stopp</Text>
                        </HStack>
                    </Button>}
                {isStopping &&
                    <HStack>
                        <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={handleReset}>
                            <HStack display={"flex"} alignItems={"end"}>
                                <GrRevert color='#ecf39eff' />
                                <Text>Zurücksetzen</Text>
                            </HStack>
                        </Button>
                        <Button width="100%" backgroundColor={"#31572cff"} _hover={{ backgroundColor: "#90a955ff" }} onClick={handleGoAhead}>
                            <HStack display={"flex"} alignItems={"end"}>
                                <FaPlay color='#ecf39eff' />
                                <Text>Fortsetzen</Text>
                            </HStack>
                        </Button>
                    </HStack>
                }
            </HStack>
        </VStack>
    );
}

export default TimerComponent;