import React, { } from 'react';
import Crop from "./Crop";
import OpenLayersMap from "./OpenLayersMap";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Flex,
    Box
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

    const { isOpen, onOpen, onClose } = useDisclosure()
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
        <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="100vw"
            height="100vh"
            gap={3}
            backgroundColor={"#f8f1e3"}
        >
            {alertInfo.showAlert &&
                <Alert status={alertInfo.alertStatus} width="auto">
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
                        right={-1}
                        top={-1}
                        onClick={() => {
                            dispatch({ type: 'alertInfo/setShowAlert', payload: false })
                            dispatch({ type: 'alertInfo/setAlertTitle', payload: null })
                            dispatch({ type: 'alertInfo/setAlertMessage', payload: null })
                        }
                        }
                    />
                </Alert>}
            <Box
                minH={"100vh"}
                width={isOpen ? "100%" : "100%"}
                flex={isOpen ? 1 : 1}
                overflowY={isOpen ? 'hidden' : 'scroll'}
                display="flex"
                justifyContent="flex-start"
                data-tour="dashboard-whole-page"
            >
                <Button colorScheme='teal' onClick={onOpen}>
                    Menü
                </Button>
                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                    size='xs'
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Menü</DrawerHeader>
                        <DrawerBody>
                            <Button onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "dashboard" })}>Start</Button>
                            <Button onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "maps" })}>Maps</Button>
                        </DrawerBody>

                        <DrawerFooter>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                {rendernPage()}
            </Box>
            {/* <Crop/> */}
        </Flex>
    );
}

export default Dashboard;