import { HexColorPicker } from "react-colorful";
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ColorPicker = () => {
    const dispatch = useDispatch()
    const colorRedux = useSelector((state: any) => state.openLayers.color)
    const [color, setColor] = useState("#aabbcc");
    console.log(color)
    useEffect(() => {
        dispatch({ type: 'openLayers/setColor', payload: color })
    }, [color])
    return (
        <HexColorPicker color={color} onChange={setColor} />
    );
}

export default ColorPicker;