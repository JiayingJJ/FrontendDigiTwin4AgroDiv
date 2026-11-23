import { useEffect, useRef, useState } from "react";
import Login from "./components/Login"
import store from "./stores/stores"
/* 
--twilight-indigo: #29335cff;
--hunter-green: #31572cff;
--brick-ember: #ba2d0bff;
--palm-leaf: #90a955ff;
--lime-cream: #ecf39eff;
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
import Dashboard, { backgroundDefault } from "./components/Dashboard";
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
  const alertInfo = useSelector((state: any) => state.alertInfo);
  useEffect(() => {
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
    // dispatch({ type: 'internet/updateDataForUpdate', payload: data })
    if (userTablesWithPending?.length !== 0) {
    }
  }
  const initDataInOPFS = async () => {
    try {
      await databaseSqlite.initDb(userInfo.id);
      await checkStatus();
      const response = await fetch(`${apiUrl}/api/data/${userInfo.id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const list = Object.entries(data).map(([key, value]) => ({ key, value }));
      list.forEach(l => {
        if (l.value !== null) {
          if (l.key === "user") {
            l.value.forEach(v => {
              databaseSqlite.insertUser(v)
            });
          } else if (l.key === "user_tables") {
            const userColumns = list.find(item => item.key === "user_columns")?.value;
            l.value.forEach(v => {
              databaseSqlite.insertUserTables(v, userColumns)
              if (v.ColumnsInTable.RawMessage !== null) {
                databaseSqlite.initUserTableId(v, userColumns)
              }
            });
          } else if (l.key === "geo_data") {
            l.value.forEach(v => {
              databaseSqlite.insertGeoData(v)
            });
          } else if (l.key === "projects") {
            l.value.forEach(v => {
              databaseSqlite.insertProjects(v)
            });
          }
        }
      });
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
    deleteFileFromOPFS('mydb.sqlite3')
  }, [])
  return (
    <VStack backgroundColor={backgroundDefault} width="100vw" height="100vh">
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
