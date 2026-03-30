import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import { OSM } from 'ol/source'
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON.js';
import MousePosition from 'ol/control/MousePosition.js';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import Geolocation from 'ol/Geolocation.js';
import { FaLocationArrow } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Point } from 'ol/geom';
import CircleStyle from 'ol/style/Circle';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Circle from 'ol/style/Circle';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape';
import * as turf from '@turf/turf';
import { IoMdCloseCircleOutline } from "react-icons/io";
import {
    Alert,
    AlertDescription,
    AlertTitle,
    AlertAction
} from "@/components/ui/alert"
const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const ortInfoRef = useRef('');
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
    const getGeoDeu = (map: Map) => {
        fetch('/data/sachsen_anhalt.geojson')
            .then((res) => {
                console.log('Response Status:', res.status);
                if (!res.ok) throw new Error(`HTTP ${res.status} - Datei nicht gefunden!`);
                return res.json();
            })
            .then((geojsonData) => {
                const features = new GeoJSON().readFeatures(geojsonData, {
                    featureProjection: 'EPSG:3857',
                });
                const stadt = features.filter((feature) =>
                    feature.values_.GEN === "Bernburg (Saale)"
                )
                getOrtCentroid(map, stadt[0])
            })
            .catch((err) => {
                console.error('❌ Fehler:', err.message);
            });
    }
    useEffect(() => {
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            view: new View({
                center: [0, 0],
                zoom: 10
            })
        })
        setOlMap(map)
        getGeoDeu(map)
        return () => map.setTarget(undefined);
    }, [])

    const getOrtCentroid = (map: Map, feature: Feature) => {
        const coordinates = feature.getGeometry().getCoordinates();
        console.log(coordinates)
        const turfPolygon = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coordinates
            }
        };
        const centroid = turf.centroid(turfPolygon);
        console.log(centroid)
        positionFeature?.setGeometry(new Point(centroid.geometry.coordinates))
        console.log(positionFeature.getGeometry())
        map?.getView().fit(positionFeature.getGeometry(), { padding: [170, 50, 30, 150], minResolution: 50 })
        map?.getView().setZoom(13)

    }
    const getMousePosition = () => {
        const pos = new MousePosition();
        console.log(pos)

        const testPos = pos.getProperties();
        console.log(testPos)
    }

    const getUserGeo = (info: string) => {
        const userInfo = info.toLowerCase();
        fetch('/data/sachsen_anhalt.geojson')
            .then((res) => {
                console.log('Response Status:', res.status);
                if (!res.ok) throw new Error(`HTTP ${res.status} - Datei nicht gefunden!`);
                return res.json();
            })
            .then((geojsonData) => {
                console.log('✅ GeoJSON geladen:', geojsonData);
                const features = new GeoJSON().readFeatures(geojsonData, {
                    featureProjection: 'EPSG:3857',
                });
                console.log("features: ", features)
                const stadt = features
                    .filter((feature) =>
                        feature.values_.GEN.toLowerCase().includes(userInfo) || feature.values_.destatis.zip === userInfo
                    )
                    .map((feature) => feature
                    );
                console.log("stadt: ", stadt)
                const point = stadt[0].getGeometry();
                console.log(point)

                getOrtCentroid(olMap, stadt[0])
                // olMap?.getView().fit(point, { padding: [170, 170, 170, 170], minResolution: 50 })
            })
            .catch((err) => {
                console.error('❌ Fehler:', err.message);
            });
    }
    const handleClick = () => {
        console.log(ortInfoRef.current?.value)
        if (ortInfoRef.current?.value !== "") {
            getUserGeo(ortInfoRef.current?.value)
        } else {
            setAlertTitle("Fehlende Informationen")
            setAlertMessage("Bitte die Ortname oder ein Postleitzahl geben.")
            setShowAlert(true)
        }
    }
    let positionFeature = new Feature();
    let accuracyFeature = new Feature();

    const positionLayer = new VectorLayer({
        source: new VectorSource({
            features: [positionFeature, accuracyFeature],
        })
    })
    const getUserLocation = () => {
        console.log("Get User Location")
        const geolocation = new Geolocation({
            projection: olMap?.getView().getProjection(),
            tracking: true,
        });
        console.log(geolocation)
        positionFeature?.setStyle(baseUserFeatureStyle)
        geolocation.on('change', function (evt) {
            console.log(geolocation.getPosition());
            positionFeature?.setGeometry(new Point(geolocation.getPosition()))
            console.log(positionFeature.getGeometry());
            olMap?.getView().fit(positionFeature.getGeometry(), {})
            olMap?.getView().setZoom(17)
        });
        console.log(geolocation)
        console.log(geolocation.getPosition())
        geolocation.on('error', function (evt) {
            window.console.log(evt.message);
        });
        olMap?.addLayer(positionLayer)
    }
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertTitle, setAlertTitle] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<boolean>(false);

    return <>
        {showAlert && <Alert className="max-w-md">
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>
                {alertMessage}
            </AlertDescription>
            <AlertAction>
                <IoMdCloseCircleOutline style={{
                    display: "flex",
                }} onClick={() => setShowAlert(false)} />
            </AlertAction>
        </Alert>}

        <Card style={{ height: "80vh", width: "70vw", color: "#f2f7f5", backgroundColor: "#475d5b" }}>
            <CardHeader>
                <CardTitle>Map</CardTitle>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center"
                }}>
                    <Input placeholder="Geben Sie ein Ortname oder ein Postleitzahl" type="text" ref={ortInfoRef} style={{color: "#f2f7f5"}}/>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FaLocationArrow size={25} style={{
                                padding: "1px",
                                marginLeft: "10px",
                                marginRight: "10px",
                                color: "#faae2b"

                            }} onClick={handleClick} />
                        </TooltipTrigger>
                        <TooltipContent>
                            Suchen
                        </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FaLocationDot style={{
                                padding: "1px",
                                marginRight: "10px",
                                color: "#fa5246"

                            }} size={25} onClick={getUserLocation} />
                        </TooltipTrigger>
                        <TooltipContent>
                            User Location
                        </TooltipContent>
                    </Tooltip>



                </div>
            </CardHeader>
            <CardContent ref={mapDivRef}
                style={{ height: "80vh", width: "70vw" }}
                onClick={() => {
                    getMousePosition()
                }} >
            </CardContent>
        </Card>


    </>

};

export default OpenLayersMap;