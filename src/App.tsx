import { useEffect, useRef, useState } from "react";
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
const apiUrl = import.meta.env.VITE_API_URL;
import { databaseSqlite } from "./components/sqlite/db"
import { deleteFileFromOPFS, deleteFolderFromOPFS } from "./components/sqlite/helper";
import { updatePendingDataFromOPFS } from "./api/dataset";
import type { DatabaseForm } from "./components/sqlite/types";

function App() {
  const userInfo = useSelector((state: any) => state.user)
  const isOnLine = useSelector((state: any) => state.internet.isOnLine)
  useEffect(() => {
    console.log(navigator.onLine)
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        dispatch({ type: 'internet/setIsOnLine', payload: true })
        if (userInfo.id !== null) {
          initDataInOPFS()
        }
      } else {
        dispatch({ type: 'internet/setIsOnLine', payload: false })
      }
    }, 3000);
    return () => clearInterval(intervalId);
  });

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
  const checkStatus = async () => {
    const userTablesWithPending = await databaseSqlite.getUserTablesWithDataStatus("pending");
    const geoDataWithPending = await databaseSqlite.getGeoDataWithDataStatus("pending")
    const data: DatabaseForm = { user_tables: [], geo_data: [] };
    data['user_tables'] = userTablesWithPending;
    data['geo_data'] = geoDataWithPending;
    const response = await updatePendingDataFromOPFS(data);
    console.log(response)
    // dispatch({ type: 'internet/updateDataForUpdate', payload: data })
    if (userTablesWithPending?.length !== 0) {
    }
  }
  const initDataInOPFS = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/data/${userInfo.id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const list = Object.entries(data).map(([key, value]) => ({ key, value }));

      await databaseSqlite.initDb();
      list.forEach(l => {
        if (l.value !== null) {
          if (l.key === "user") {
            l.value.forEach(v => {
              databaseSqlite.insertUser(v)
            });
          } else if (l.key === "user_tables") {
            l.value.forEach(v => {
              databaseSqlite.insertUserTables(v)
            });
          } else if (l.key === "geo_data") {
            l.value.forEach(v => {
              if (v.data_geo !== null) {
                databaseSqlite.insertGeoData(v.data_geo)
              }
            });
          }
        }
      });
      await checkStatus();
    } catch (err: any) {
      console.error("Init failed:", err);
    }
  }
  useEffect(() => {
    if (userInfo.id !== null && isOnLine) {
      initDataInOPFS();
    }
  }, [userInfo])

  useEffect(() => {
    // deleteFileFromOPFS('mydb.sqlite3')
  }, [])
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
