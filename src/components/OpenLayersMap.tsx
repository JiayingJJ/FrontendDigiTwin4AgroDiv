import { useEffect, useRef, useState } from 'react';
// OpenLayers
import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import { OSM } from 'ol/source';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON.js';
import MousePosition from 'ol/control/MousePosition.js';
import Geolocation from 'ol/Geolocation.js';
import VectorImageLayer from 'ol/layer/VectorImage.js';
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
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import {
    Alert,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
// Icons
import { FaLocationArrow } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdCloseCircleOutline } from "react-icons/io";
// Rest
import * as turf from '@turf/turf';
// Components
import MapActions from './MapActions';
import TulpePic from '../assets/Tulpe.jpg'
// import ModalShowInfo from './ModalShowInfo';
import { useSelector, useDispatch } from 'react-redux';
const OpenLayersMap = () => {
    const dispatch = useDispatch()

    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const ortInfoRef = useRef('');
    const geoJSONSource = '/data/deutschland.geojson'
    const [imageSrc, setImageSrc] = useState<String>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [alertTitle, setAlertTitle] = useState<string>("");
    const [alertMessage, setAlertMessage] = useState<string>("");
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
    const layers = {
        standard: new TileLayer({
            source: new OSM(),
        }),
        outdoors: new TileLayer({
            source: new StadiaMaps({ layer: 'outdoors' }),
        }),
        terrain: new TileLayer({
            source: new StadiaMaps({ layer: 'stamen_terrain' }),
        }),
        watercolor: new TileLayer({
            source: new StadiaMaps({ layer: 'stamen_watercolor' }),
        })
    };
    const getGeoDeu = (map: Map) => {
        fetch(`${geoJSONSource}`)
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
                layers.standard
            ],
            view: new View({
                center: [0, 0],
                zoom: 10
            })
        })
        setOlMap(map)
        getGeoDeu(map)
        console.log(map)
        map.addLayer(vectorLayer)
        return () => map.setTarget(undefined);
    }, [])

    const newStyle = [new Style({
        stroke: new Stroke({
            color: 'blue',
            width: 1,
            lineDash: [30, 10],
        }),
        fill: new Fill({
            color: 'rgba(0, 255, 0, 0.3)',
        }),

    }), new Style({
        image: new Icon({
            src: TulpePic,
            scale: 0.01,
            anchor: [0.5, 0.5],
        }),
        geometry: (feature) => {
            return feature?.getGeometry().getInteriorPoint();
        },
    })
    ]
    olMap?.on('click', (e) => {
        console.log(e)
        const feature = olMap.forEachFeatureAtPixel(e.pixel, (f) => f)
        console.log(feature)
        if (feature) {
            setImageSrc(TulpePic)
            feature.setStyle(newStyle)
        }
        console.log(feature?.getKeys())

    })
    olMap?.on('pointermove', (event) => {
        const hit = olMap.hasFeatureAtPixel(event.pixel);
        olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    const switchLayer = (layerType: string) => {
        olMap?.getLayers().clear();
        dispatch({ type: 'openLayers/setLayerType', payload: layerType })
        switch (layerType) {
            case "standard":
                olMap?.addLayer(layers["standard"]);
                break;
            case "outdoors":
                olMap?.addLayer(layers["outdoors"]);
                break;
            case "stamen_terrain":
                olMap?.addLayer(layers["terrain"]);
                break;
            case "stamen_watercolor":
                olMap?.addLayer(layers["watercolor"]);
                break;
            default:
                olMap?.addLayer(layers["standard"]);
        }
    }

    const vectorLayer = new VectorLayer({
        source: new VectorSource({
            url: "./data/test.geojson",
            format: new GeoJSON()
        }),
        visible: true,
        style: (feature) => {
            const geometryType = feature.getGeometry().getType();
            console.log(geometryType)
            if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                return new Style({
                    image: new Icon({
                        src: TulpePic,
                        scale: 0.1,
                        size: [512, 512],
                        anchor: [0.5, 1],
                        width: 32,
                        height: 32,
                    }),
                });
            }
            if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
                return new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        width: 1,
                        lineDash: [30, 10],
                    }),
                });
            }
            if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                return [new Style({
                    stroke: new Stroke({
                        color: 'blue',
                        width: 1,
                        lineDash: [30, 10],
                    }),
                    fill: new Fill({
                        color: 'rgba(0, 255, 0, 0.3)',
                    }),
                }),
                ]
            }
        }
    });

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
        // const pos = new MousePosition({
        //     projection: olMap?.getView().getProjection(),
        //     coordinateFormat: ol.coordinate.createStringXY(2)
        // });
        // console.log(pos)
        // olMap?.addControl(pos)
        // console.log(olMap)
        // const testPos = pos.getProperties();
        // console.log(testPos)
    }

    const getUserGeo = (info: string) => {
        const userInfo = info.toLowerCase();
        fetch(`${geoJSONSource}`)
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
                        feature.values_.GEN.toLowerCase().includes(userInfo) || feature.values_.destatis?.zip === userInfo
                    )
                    .map((feature) => feature
                    );
                console.log("stadt: ", stadt)
                const point = stadt[0].getGeometry();
                console.log(point)

                getOrtCentroid(olMap, stadt[0])
            })
            .catch((err) => {
                console.error('❌ Fehler:', err.message);
            });
    }
    const getLocation = () => {
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
        console.log(olMap?.getLayers())
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
        geolocation.on('error', function (evt) {
            window.console.log(evt.message);
        });
        const layers = olMap?.getLayers().getArray();
        const exists = layers.includes(positionLayer);
        if (!exists) {
            olMap?.addLayer(positionLayer)
        }
    }


    return <>
        {showAlert && <Alert className="max-w-md" zIndex="2">
            <AlertTitle>{alertTitle}</AlertTitle>
            <AlertDescription>
                {alertMessage}
            </AlertDescription>
            <IoMdCloseCircleOutline style={{
                display: "flex",
            }} onClick={() => setShowAlert(false)} />
        </Alert>}

        <Card style={{ height: "80vh", width: "70vw", color: "#f2f7f5", backgroundColor: "#475d5b" }}>
            <CardHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center"
                }}>
                    <Input placeholder="Geben Sie ein Ortname oder ein Postleitzahl" type="text" ref={ortInfoRef} style={{ color: "#f2f7f5" }} />

                    <Tooltip>
                        <FaLocationArrow size={25} style={{
                            padding: "1px",
                            marginLeft: "10px",
                            marginRight: "10px",
                            color: "#faae2b"

                        }} onClick={getLocation} />
                    </Tooltip>

                    <Tooltip>
                        <FaLocationDot style={{
                            padding: "1px",
                            marginRight: "10px",
                            color: "#fa5246"

                        }} size={25} onClick={getUserLocation} />
                    </Tooltip>



                </div>
            </CardHeader>
            <CardBody ref={mapDivRef}
                style={{ height: "80vh", width: "70vw" }}
                onClick={() => {
                    getMousePosition()
                }} >
            </CardBody>
        </Card>
        <MapActions switchLayer={switchLayer} />
        {/* <ModalShowInfo imageSrc={imageSrc} /> */}
    </>

};

export default OpenLayersMap;