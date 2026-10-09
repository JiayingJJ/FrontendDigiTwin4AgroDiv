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
import { getTablesWithUserId, getUserTablesWithProjectId } from '../api/userTables';
import ProjectsComponent from './Projects/ProjectsComponent';
import ModalComponent from './ModalComponent';
import { getAllProjectsWithShared, getProjectWithCreatorId } from '../api/projects';
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
            case "projects":
                return <ProjectsComponent />
            default:
                return <InfoPage />
        }
    }


    useEffect(() => {
        async function fechtData() {
            let allProjects: any = [];
            let allUserTables: any = [];
            if (isOnLine) {
                // get projects with user as creator
                const projectData = await getProjectWithCreatorId(userInfo.id)
                projectData[0].map((d: any) => {
                    if (!d.deleted_at.Valid) {
                        allProjects.push(d);
                    }
                })
                // get user_tables with user as creator
                const data = await getTablesWithUserId(userInfo)
                data.map((d: any) => {
                    if (!d.deleted_at.Valid) {
                        allUserTables.push(d);
                    }
                });
                // get projects and user_tables with user as member
                const projectDataShared = await getAllProjectsWithShared(userInfo.id)
                await Promise.all(projectDataShared[0].map(async (d: any) => {
                    // projects
                    if (!d.deleted_at.Valid) {
                        allProjects.push(d);
                    }
                    // user_tables
                    const getUserTablesWithSharedProjects = await getUserTablesWithProjectId(d.id)
                    console.log(getUserTablesWithSharedProjects)
                    getUserTablesWithSharedProjects.map((sharedUT: any) => {
                        allUserTables.push(sharedUT);
                    })

                }))
                dispatch({ type: 'projects/setAllProjects', payload: allProjects })
                dispatch({ type: 'datasetTable/setTables', payload: allUserTables })
            } else {
                await databaseSqlite.initDb();
                const data = await databaseSqlite.getUserTablesWithUserId(userInfo.id)
                const filterData = data?.filter((d: any) => {
                    const notDelete = isZeroTimeString(d.deleted_at)
                    if (notDelete) {
                        return d;
                    }
                })
                dispatch({ type: 'datasetTable/setTables', payload: filterData })
            }

        }
        fechtData()
    }, [])

    return (
        <VStack width={"100vw"} height={"100vh"}>
            <HStack
                justifyContent={"space-between"}
                width={"100vw"}
                height={"10vh"}
                padding={"1rem 3vw"}
                gap="2rem"
                backgroundColor="#31572cff"
            >
                <Button width="100%" backgroundColor={activePage == "dashboard" ? "#ba2d0bff" : "#F7EDE2"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "dashboard" })}>Start</Button>
                <Button width="100%" backgroundColor={activePage == "maps" ? "#ba2d0bff" : "#F7EDE2"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "maps" })}>Maps</Button>
                <Button width="100%" backgroundColor={activePage == "projects" ? "#ba2d0bff" : "#F7EDE2"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "projects" })}>Projects</Button>
                <Button width="100%" backgroundColor={activePage == "datenbank" ? "#ba2d0bff" : "#F7EDE2"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })}>Datenbank</Button>
                <Button width="100%" backgroundColor={activePage == "tableview" ? "#ba2d0bff" : "#F7EDE2"} _hover={{ backgroundColor: "#ecf39eff" }} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "tableview" })}>Datenbank Sicht</Button>
            </HStack>
            {rendernPage()}
            <ModalComponent />
        </VStack>
    );
}

export default Dashboard;