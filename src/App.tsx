import { useEffect } from "react";
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
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from "react-router-dom";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  const dispatch = useDispatch()
  console.log(store.getState())
  const alertInfo = useSelector((state: any) => state.alertInfo);
  useEffect(() => {
    console.log(alertInfo.showAlert)
    if (alertInfo.showAlert === true) {
      const intervalId = setInterval(() => {
        dispatch({ type: 'alertInfo/setShowAlert', payload: false })
        dispatch({ type: 'alertInfo/setAlertTitle', payload: null })
        dispatch({ type: 'alertInfo/setAlertMessage', payload: null })
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [alertInfo]);
  return (
    <VStack style={{ backgroundColor: "#f8f1e3", width: "100vw", height: "100vh" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
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
