import React, { useEffect } from 'react';
import {
    Button,
    HStack,
    VStack,
} from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux';
import OpenLayersMap from "./Maps/OpenLayersMap";
import InfoPage from './InfoPage';
import Datasets from './Datasets/Datasets';
import DatasetsTable from './TableView/DatasetsTable';
import { databaseSqlite } from './sqlite/db';
import { getCreatedAndSharedInfo, isZeroTimeString } from '../helpers';
import ProjectsComponent from './Projects/ProjectsComponent';
import ModalComponent from './ModalComponent';
const Dashboard = () => {
    const dispatch = useDispatch()
    const activePage = useSelector((state: any) => state.page.pageName)
    const userInfo = useSelector((state: any) => state.user)
    const isOnLine = useSelector((state: any) => state.internet.isOnLine)
    const getUpdate = useSelector((state: any) => state.page.getUpdate)

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

    const fechtData = async () => {
        if (isOnLine) {
            const data = await getCreatedAndSharedInfo(userInfo.id)
            dispatch({ type: 'openLayers/setGeodata', payload: data.allGeoData })
            dispatch({ type: 'projects/setAllProjects', payload: data.allProjects })
            dispatch({ type: 'datasetTable/setTables', payload: data.allUserTables })
            dispatch({ type: 'datasetTableView/setTables', payload: data.allUserTables })
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
    useEffect(() => {
        fechtData()
    }, [])
    useEffect(() => {
        if (getUpdate) {
            fechtData()
        }
    }, [getUpdate])
    return (
        <VStack width={"100vw"} height={"100vh"}>
            <HStack
                justifyContent={"space-between"}
                width={"100vw"}
                height={"10vh"}
                padding={"1rem 3vw"}
                gap="2rem"
                backgroundColor={backgroundAccent}
            >
                <Button width="100%" isActive={activePage == "dashboard"} {...buttonStyle} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "dashboard" })}>Start</Button>
                <Button width="100%" isActive={activePage == "maps"} {...buttonStyle} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "maps" })}>Maps</Button>
                <Button width="100%" isActive={activePage == "projects"} {...buttonStyle} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "projects" })}>Projects</Button>
                <Button width="100%" isActive={activePage == "datenbank"} {...buttonStyle} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "datenbank" })}>Datenbank</Button>
                <Button width="100%" isActive={activePage == "tableview"} {...buttonStyle} onClick={() => dispatch({ type: 'pageInfo/setPageName', payload: "tableview" })}>Datenbank Sicht</Button>
            </HStack>
            {rendernPage()}
            <ModalComponent />
        </VStack>
    );
}

export const colorGood = "hsl(100, 50%, 75%)"
export const colorBad = "hsl(5, 75%, 75%)"
export const colorDanger = "hsl(12, 89%, 39%)"
export const colorTitle = "hsl(220, 39%, 49%)"
const buttonDefault = "hsl(41, 66%, 84%)";
const buttonDefaultTransparent = "hsl(41, 66%, 84%, 35%)";
const buttonGhostDefault = "hsl(41, 66%, 84%, 0%)";
const buttonHovered = "hsl(192, 30%, 80%)";
export const buttonActive = "hsl(338, 26%, 73%)";
const buttonDisabled = "hsl(40, 7%, 57%)";
const buttonTextDisabled = "hsl(40, 0%, 20%)";
export const backgroundDefault = "hsl( 40, 60%, 93%)";
export const backgroundAccent = "hsl(220, 18%, 23%)";
export const titleStyle = { backgroundColor: colorTitle, color: "white" };
export const buttonStyle = { "backgroundColor": buttonDefault, "_active": { "backgroundColor": buttonActive }, "_hover": { "backgroundColor": buttonHovered }, "_disabled": { "backgroundColor": buttonDisabled, "color": buttonTextDisabled, cursor: "not-allowed" } };
export const buttonGhostStyle = { ...buttonStyle, "backgroundColor": buttonGhostDefault, "_disabled": { backgroundColor: "unset", color: buttonDisabled } };

export const buttonGoodStyle = { ...buttonStyle, "backgroundColor": colorGood };
export const buttonBadStyle = { ...buttonStyle, "backgroundColor": colorBad };
export const buttonDangerStyle = { ...buttonStyle, "backgroundColor": colorDanger, color: "white" };

export const buttonIconStyle = {
    ...buttonStyle,
    backgroundColor: buttonDefaultTransparent, outlineColor: buttonDefault, outlineWidth: "medium",
    _active: { backgroundColor: buttonDefault },
    _hover: { backgroundColor: buttonDefault },
    _disabled: buttonGhostStyle._disabled,
}

export default Dashboard;