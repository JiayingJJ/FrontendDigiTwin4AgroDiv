import React, { useEffect } from 'react';
import {
    Button,
    Box,
    HStack,
    VStack,
    Alert,
    AlertTitle,
    AlertDescription,
    AlertIcon,
    CloseButton
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import OpenLayersMap from "./Maps/OpenLayersMap";
import InfoPage from './InfoPage';
import Datasets from './Datasets/Datasets';
import DatasetsTable from './TableView/DatasetsTable';
import { databaseSqlite } from './sqlite/db';
import { isZeroTimeString } from '../helpers';
import { getTablesWithUserId } from '../api/userTables';
const Dashboard = () => {
    const dispatch = useDispatch()
    const activePage = useSelector((state: any) => state.page.pageName)
    const userInfo = useSelector((state: any) => state.user)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)

    const rendernPage = () => {
        switch (activePage) {
            case "maps":
                return <OpenLayersMap />
            case "datenbank":
                return <Datasets />
            case "dashboard":
                return <InfoPage />
            case "tableview":
                return <DatasetsTable />
            default:
                return <InfoPage />
        }
    }

    
    useEffect(() => {
        async function fechtData() {
            console.log(isOnLine)
            if (isOnLine) {
                const data = await getTablesWithUserId(userInfo)
                console.log(data)
                const filterData = data.filter((d: any) => {
                    if (!d.deleted_at.Valid) {
                        return d;
                    }
                });
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
            } else {
                await databaseSqlite.initDb();
                const data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
                const filterData = data?.filter((d: any) => {
                    const notDelete = isZeroTimeString(d.deleted_at)
                    console.log(notDelete)
                    if (notDelete) {
                        return d;
                    }
                })
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
                console.log(data)
            }

        }
        fechtData()
    }, [])

    return (
        <VStack width={"100vw"} height={"100vh"}>
            <HStack
                justifyContent={"space-between"}
                width={"100vw"}
                padding={"1rem 5vw"}
                gap="2rem"
                backgroundColor="#14342B"
            >
                <Button width="100%" backgroundColor={activePage == "dashboard" ? "#E8871E" : "#F7EDE2"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "dashboard" })}>Start</Button>
                <Button width="100%" backgroundColor={activePage == "maps" ? "#E8871E" : "#F7EDE2"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "maps" })}>Maps</Button>
                <Button width="100%" backgroundColor={activePage == "datenbank" ? "#E8871E" : "#F7EDE2"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })}>Datenbank</Button>
                <Button width="100%" backgroundColor={activePage == "tableview" ? "#E8871E" : "#F7EDE2"} _hover={{ backgroundColor: "#EDB458" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "tableview" })}>Datenbank Sicht</Button>
            </HStack>
            {rendernPage()}
        </VStack>
    );
}

export default Dashboard;