import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
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
const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const ortInfoRef = useRef('');

    useEffect(() => {

    }, [])
    const getGeoDeu = (map: Map) => {
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
                const stadt = features.filter((feature) =>
                    feature.values_.GEN === "Bernburg (Saale)"
                )
                console.log("stadt: ", stadt)

                const point = stadt[0].getGeometry();
                console.log(point)
                const coor = point?.getCoordinates();
                console.log(coor)
                map?.getView().fit(point, { padding: [170, 50, 30, 150], minResolution: 50 })
                map?.getView().setZoom(12)
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
                const coor = point?.getCoordinates();
                console.log(coor)
                olMap?.getView().fit(point, { padding: [170, 50, 30, 150], minResolution: 50 })
                olMap?.getView().setZoom(15)
            })
            .catch((err) => {
                console.error('❌ Fehler:', err.message);
            });
    }
    const handleClick = () => {
        console.log(ortInfoRef.current?.value)
        getUserGeo(ortInfoRef.current?.value)
    }
    return <>
        <Card style={{ height: "80vh", width: "70vw" }}>
            <CardHeader>
                <CardTitle>Map</CardTitle>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center"
                }}>
                    <Input placeholder="Geben Sie ein Ortname oder ein Postleitzahl" type="text" ref={ortInfoRef} />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <FaLocationArrow size={25} style={{
                                padding: "1px",
                                marginLeft: "10px",
                                marginRight: "10px"

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
                                marginRight: "10px"

                            }} size={25} onClick={() => console.log("Get User Location")} />
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