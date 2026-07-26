import RendernInfo from './DatasetsInMaps/RendernInfo';
import AddDataInTable from './AddDataInTable';
import AllInfoForDrawedInTable from './DatasetsInMaps/AllInfoForDrawedInTable';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardHeader, CardBody, VStack, HStack, Button, CardFooter, Tooltip } from '@chakra-ui/react'
import { FaCloudUploadAlt } from "react-icons/fa";
import { insertGeoData, setGeoDataStatus } from '../../api/geoData';
import ColorPicker from './ColorPicker';
import { IoIosColorPalette } from "react-icons/io";
const DataUserLayer = () => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state: any) => state.user)
    const geometry = useSelector((state: any) => state.openLayers.geometry)
    const geometryType = useSelector((state: any) => state.openLayers.geometryType)
    const showUserDataLayer = useSelector((state: any) => state.openLayers.showUserDataLayer)
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const rendernDataInfo = useSelector((state: any) => state.openLayers.rendernDataInfo)
    const rendernGeoDataList = useSelector((state: any) => state.openLayers.rendernGeoDataList)
    const selectedGeoInfo = useSelector((state: any) => state.openLayers.selectedGeoInfo)
    const colorRedux = useSelector((state: any) => state.openLayers.userSelectedColor)
    const [colorPicker, setColorPicker] = useState(false);
    const addNewColumnsDataInGeometry = useSelector((state: any) => state.openLayers.addNewColumnsDataInGeometry)

    const showGeoJSON = () => {
        dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: false })
        dispatch({ type: 'openLayers/setRendernGeoDataList', payload: false })
        dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: false })
        dispatch({ type: 'datasetTable/setTableColumns', payload: [] })
        dispatch({ type: 'openLayers/clearReduxForGeoData', payload: [] })
        dispatch({ type: 'openLayers/setShowUserDataLayer', payload: !showUserDataLayer })
    };
    const uploadGeomery = async () => {
        console.log(userInfo.id)
        const geoData = { "coordinates": geometry, "type": geometryType }
        console.log(geoData)
        const data = await insertGeoData(userInfo.id, {}, geoData, colorRedux)
        if (data[1] === 500) {
            console.log("Alert Message")
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'error' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Error Message" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Error daten" })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        } else {
            const dataStatus = await setGeoDataStatus(data[0].id, "merged")
            dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: false })
        }
    }
    return (
        <HStack width={"100%"} justifyContent={"space-between"}>
            <Card borderRadius={"0.5rem"} pointerEvents={"auto"} opacity="0.9">
                <CardBody padding={"0rem .7rem"}>
                    <Button variant="unstyled" onClick={showGeoJSON}>{!showUserDataLayer ? "Daten laden und anzeigen" : "Daten verstecken"}</Button>
                </CardBody>
            </Card>

            <Card borderRadius={"0.5rem"} pointerEvents={"auto"} opacity="0.9">
                <CardBody padding={"0rem .7rem"}>
                    {(addDrawedInteractionInfo || (selectedGeoInfo !== null && selectedGeoInfo.data_status === "pending")) && <Tooltip label={"Ein Punkt oder ein Polygon hinzufügen"} hasArrow >
                        <Button variant={"unstyled"}>
                            <FaCloudUploadAlt style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => uploadGeomery()} />
                        </Button>
                    </Tooltip>}
                    {selectedGeoInfo !== null &&
                        <Button variant={"unstyled"}>
                            <IoIosColorPalette style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => setColorPicker(!colorPicker)} />
                        </Button>}
                    {colorPicker && <ColorPicker />}
                    {rendernGeoDataList && <AllInfoForDrawedInTable />}
                    {rendernDataInfo && <RendernInfo />}
                    {(addDrawedInteractionInfo || addNewColumnsDataInGeometry) && <AddDataInTable />}
                </CardBody>
            </Card>
        </HStack>
    );
}

export default DataUserLayer;