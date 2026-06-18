import { FaLocationDot } from "react-icons/fa6";
import { Feature, Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import CircleStyle from 'ol/style/Circle';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Geolocation from 'ol/Geolocation.js';
import { Button } from "@chakra-ui/react";

type Props = {
    olMap: Map,
    positionFeature: Feature
};
const GetUserLocation = ({ olMap, positionFeature }: Props) => {
    let accuracyFeature = new Feature();
    const baseUserFeatureStyle = new Style({
        image: new CircleStyle({
            radius: 12,
            fill: new Fill({
                color: '#3399CC'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2,
            })
        })
    })

    const positionLayer = new VectorLayer({
        source: new VectorSource({
            features: [positionFeature, accuracyFeature],
        })
    })
    const getUserLocation = () => {
        const geolocation = new Geolocation({
            projection: olMap?.getView().getProjection(),
            tracking: true,
        });
        positionFeature?.setStyle(baseUserFeatureStyle)
        geolocation.on('change', function (evt) {
            positionFeature?.setGeometry(new Point(geolocation.getPosition()))
            olMap?.getView().fit(positionFeature.getGeometry(), {})
            olMap?.getView().setZoom(17)
        });
        geolocation.on('error', function (evt) {
            window.console.log(evt.message);
        });
        const layers = olMap?.getLayers().getArray();
        const exists = layers.includes(positionLayer);
        if (!exists) {
            olMap?.addLayer(positionLayer)
        }
    }
    return (
        <Button variant={"unstyled"}>
            <FaLocationDot style={{
                padding: "1px",
                marginLeft: "10px",
                marginRight: "10px",
                color: "#fa5246"
            }} size={25} onClick={getUserLocation} />
        </Button>
    );
}

export default GetUserLocation;