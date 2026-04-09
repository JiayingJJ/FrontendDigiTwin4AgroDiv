import React, { } from 'react';
import OpenLayersMap from "./Maps/OpenLayersMap";
import {
    Button,
    Box,
    HStack,
    VStack
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import {
    Alert,
    AlertTitle,
    AlertDescription,
    AlertIcon,
    CloseButton
} from '@chakra-ui/react'
import InfoPage from './InfoPage';
const Dashboard = () => {
    const dispatch = useDispatch()
    const activePage = useSelector((state: any) => state.page.pageName)
    const alertInfo = useSelector((state: any) => state.alertInfo);
    const rendernPage = () => {
        switch (activePage) {
            case "maps":
                return <OpenLayersMap />
            case "dashboard":
                return <InfoPage />
            default:
                return <InfoPage />
        }
    }

    return (
        <VStack
            minH={"100vh"}
            width={"100%"}
            flex={1}
            display="flex"
            justifyContent="flex-start"
            data-tour="dashboard-whole-page"
            backgroundColor={"#f8f1e3"}
        >
            {alertInfo.showAlert &&
                <Alert status={alertInfo.alertStatus} width="auto" 
                    position="fixed"
                    top="10px"
                    shadow={"lg"}
                    zIndex="banner"
                    pointerEvents="auto"
                    borderRadius={"5px"}
                    >
                    <AlertIcon />
                    <Box>
                        <AlertTitle>{alertInfo.alertTitle}</AlertTitle>
                        <AlertDescription>
                            {alertInfo.alertMessage}
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf='flex-start'
                        position='relative'
                        right={-3}
                        top={-2}
                        onClick={() => {
                            dispatch({ type: 'alertInfo/setShowAlert', payload: false })
                            dispatch({ type: 'alertInfo/setAlertTitle', payload: null })
                            dispatch({ type: 'alertInfo/setAlertMessage', payload: null })
                        }
                        }
                    />
                </Alert>}
         
            <HStack 
                justifyContent={"space-between"} 
                width={"100vw"} 
                padding={"1rem 5vw"} 
                gap="2rem"
                backgroundColor="#14342B"
            >
                <Button width="100%" backgroundColor={activePage == "dashboard" ? "#E8871E" : "#F7EDE2"} _hover={{backgroundColor: "#EDB458"}} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "dashboard" })}>Start</Button>
                <Button width="100%" backgroundColor={activePage == "maps"      ? "#E8871E" : "#F7EDE2"} _hover={{backgroundColor: "#EDB458"}} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "maps" })}>Maps</Button>
            </HStack>
            {rendernPage()}
        </VStack>
    );
}

export default Dashboard;