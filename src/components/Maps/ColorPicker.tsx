import { HexColorPicker } from "react-colorful";
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Box } from '@chakra-ui/react'
import { setGeoDataStatus, updateGeoDataColor } from "../../api/geoData";
type Props = {
}
const ColorPicker = () => {
    const dispatch = useDispatch()
    const colorRedux = useSelector((state: any) => state.openLayers.userSelectedColor)
    const [color, setColor] = useState(colorRedux);
    const selectedGeoInfo = useSelector((state: any) => state.openLayers.selectedGeoInfo)
    useEffect(() => {
        dispatch({ type: 'openLayers/setUserSelectedColor', payload: color })
    }, [color])
    const handlerChangeColor = async () => {
        const data = await updateGeoDataColor(selectedGeoInfo.id, color, "pending")
        if (data[1] !== 200) {

        } else {
            const dataStatus = await setGeoDataStatus(data[0].id, "merged")
        }
    }
    return (
        <Box>
            <HexColorPicker color={color} onChange={setColor} />
            <CiCircleCheck color="green" size="40" onClick={() => handlerChangeColor()} />
        </Box>

    );
}

export default ColorPicker;