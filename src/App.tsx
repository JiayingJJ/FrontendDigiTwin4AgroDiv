import Login from "./components/Login"
import store from "./stores/stores"
/* 
003E1F deep forest
14342B evergreen
60935D sage green
FB3640 strawberry
EDB458 honey bronze
E8871E amber earth
F7EDE2 linen
*/
import {
  Box,
  VStack,
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  CloseButton
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
function App() {
  const dispatch = useDispatch()
  console.log(store.getState())
  const alertInfo = useSelector((state: any) => state.alertInfo);
  return (
    <VStack style={{ backgroundColor: "#f8f1e3", width: "100vw", height: "100vh" }}>
      <Login />
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
    </VStack>
  )
}

export default App
