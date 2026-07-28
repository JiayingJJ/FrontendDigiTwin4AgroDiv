import { HexColorPicker } from "react-colorful";
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Box, HStack } from '@chakra-ui/react'
import { setGeoDataStatus, updateGeoDataColor } from "../../api/geoData";
type Props = {
}
const ColorPicker = () => {
    const dispatch = useDispatch()
    const colorRedux = useSelector((state: any) => state.openLayers.userSelectedColor)
    const [color, setColor] = useState(colorRedux !== null ? colorRedux : "#fff");
    const selectedGeoInfo = useSelector((state: any) => state.openLayers.selectedGeoInfo)
    const setAlert = (status: string, title: string, msg: string, show: boolean) => {
        dispatch({ type: 'alertInfo/setAlertStatus', payload: status })
        dispatch({ type: 'alertInfo/setAlertTitle', payload: title })
        dispatch({ type: 'alertInfo/setAlertMessage', payload: msg })
        dispatch({ type: 'alertInfo/setShowAlert', payload: show })
    }
    useEffect(() => {
        dispatch({ type: 'openLayers/setUserSelectedColor', payload: color })
    }, [color])
    const handlerChangeColor = async () => {
        const data = await updateGeoDataColor(selectedGeoInfo.id, color, "pending")
        if (data[1] !== 200) {

        } else {
            const dataStatus = await setGeoDataStatus(data[0].id, "merged")
            dispatch({ type: 'openLayers/setColorPicker', payload: false })
            setAlert("success", "Color changed", "Color has successful changed", true)
        }
    }
    return (
        <HStack style={{ display: "flex", alignItems: "end" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <CiCircleCheck color="green" size="40" onClick={() => handlerChangeColor()} cursor={"pointer"} />
        </HStack>

    );
}

export default ColorPicker;