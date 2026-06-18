import RendernInfo from './DatasetsInMaps/RendernInfo';
import AddDataInTable from './AddDataInTable';
import AllInfoForDrawedInTable from './DatasetsInMaps/AllInfoForDrawedInTable';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, VStack, HStack, Button, CardFooter } from '@chakra-ui/react'

const DataUserLayer = () => {
    const dispatch = useDispatch()
    const showUserDataLayer = useSelector((state: any) => state.openLayers.showUserDataLayer)
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const rendernDataInfo = useSelector((state: any) => state.openLayers.rendernDataInfo)
    const rendernGeoDataList = useSelector((state: any) => state.openLayers.rendernGeoDataList)
    const showGeoJSON = () => {
        dispatch({ type: 'openLayers/clearReduxForGeoData', payload: [] })
        dispatch({ type: 'openLayers/setShowUserDataLayer', payload: !showUserDataLayer })
    };
    return (
        <HStack width={"100%"} justifyContent={"space-between"}>
            <Card borderRadius={"0.5rem"} pointerEvents={"auto"} opacity="0.9">
                <CardBody padding={"0rem .7rem"}>
                    <Button variant="unstyled" onClick={showGeoJSON}>{!showUserDataLayer ? "Daten laden und anzeigen" : "Daten verstecken"}</Button>
                </CardBody>
            </Card>

            <Card borderRadius={"0.5rem"} pointerEvents={"auto"} opacity="0.9">
                <CardBody padding={"0rem .7rem"}>
                    {addDrawedInteractionInfo && <AddDataInTable />}
                    {rendernDataInfo && <RendernInfo />}
                    {rendernGeoDataList && <AllInfoForDrawedInTable />}
                </CardBody>
            </Card>
        </HStack>
    );
}

export default DataUserLayer;