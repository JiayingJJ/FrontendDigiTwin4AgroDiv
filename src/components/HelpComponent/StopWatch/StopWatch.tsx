import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { VStack, HStack, IconButton, Heading, Button, Text } from '@chakra-ui/react'
import { FaPlay, FaStop } from "react-icons/fa";
import { GrRevert } from "react-icons/gr";
const StopWatch = () => {
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isStopping, setIsStopping] = useState<boolean>(false);
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const intervalIdRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning && !isStopping) {
            intervalIdRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current)
            }, 10)
        }
        return () =>
            clearInterval(intervalIdRef.current)
    }, [isRunning, isStopping])

    const handleStart = () => {
        setIsRunning(true)
        startTimeRef.current = Date.now() - elapsedTime;
    }

    const handleStop = () => {
        setIsStopping(true)
    }

    const handleReset = () => {
        setIsRunning(false)
        setIsStopping(false)
        setElapsedTime(0)
    }
    const handleGoAhead = () => {
        setIsStopping(false)
        startTimeRef.current = Date.now() - elapsedTime;
    }
    const handleFormatTime = () => {
        let hours = Math.floor(elapsedTime / (1000 * 60 * 60)).toString()
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60).toString()
        let seconds = Math.floor(elapsedTime / (1000) % 60).toString()
        hours = String(hours).padStart(2, "0");
        minutes = String(minutes).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`
    }
    return (
        <VStack>
            <Heading>{handleFormatTime()}</Heading>
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

export default StopWatch;