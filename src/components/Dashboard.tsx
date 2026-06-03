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
import { getTablesWithUserId } from '../api/dataset';
import DatasetsTable from './TableView/DatasetsTable';
const Dashboard = () => {
    const dispatch = useDispatch()
    const activePage = useSelector((state: any) => state.page.pageName)
    const userInfo = useSelector((state: any) => state.user)
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
            const data = await getTablesWithUserId(userInfo)
            const filterData = data.filter((d: any) => {
                if (!d.DeletedAt.Valid) {
                    return d;
                }
            });
            dispatch({ type: 'datasetTable/setTables', payload: filterData })
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