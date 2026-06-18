import { FaLocationArrow } from "react-icons/fa6";
import { useDispatch } from 'react-redux';
import { Map } from 'ol';
import { Button } from "@chakra-ui/react";

type Props = {
    olMap: Map,
    getUserGeo: (map: Map, info: string) => void,
    ortInfoRef: any
};
const GetLocationWithUserInput = ({ olMap, getUserGeo, ortInfoRef }: Props) => {
    const dispatch = useDispatch()

    const getLocation = () => {
        if (ortInfoRef.current?.value !== "") {
            getUserGeo(olMap, ortInfoRef.current?.value)
        } else {
            dispatch({ type: 'alertInfo/setAlertStatus', payload: 'warning' })
            dispatch({ type: 'alertInfo/setAlertTitle', payload: "Fehlende Informationen" })
            dispatch({ type: 'alertInfo/setAlertMessage', payload: "Bitte die Ortname oder ein Postleitzahl geben." })
            dispatch({ type: 'alertInfo/setShowAlert', payload: true })
        }
    }
    return (
        <Button variant={"unstyled"}>
            <FaLocationArrow size={25} style={{
                padding: "1px",
                marginLeft: "10px",
                marginRight: "10px",
                color: "#faae2b"
            }} onClick={getLocation} />
        </Button>
    );
}

export default GetLocationWithUserInput;