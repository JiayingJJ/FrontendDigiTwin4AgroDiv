import OpenLayersMap from "./components/OpenLayersMap"
import { ChakraProvider } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import Crop from "./components/Crop"
import Login from "./components/Login"
import store from "./stores/stores"
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()
  console.log(store.getState())
  const alertInfo = useSelector((state: any) => state.alertInfo);
  return (
    <ChakraProvider>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100vw"
        height="100vh"
        gap={3}
        style={{
          background: "#F8F4E3"
        }}
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
        <Login />
        <OpenLayersMap />
        <Crop />
      </Flex>
    </ChakraProvider>
  )
}

export default App
