import { useEffect, useRef, useState } from 'react';
// OpenLayers
import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON.js';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Icon from 'ol/style/Icon';
import { Card, CardHeader, CardBody } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import { Input, Box } from '@chakra-ui/react'
// Rest
import * as turf from '@turf/turf';
// Components
import MapActions from './MapActions';
import TulpePic from '../../assets/Tulpe.jpg'
import { useSelector, useDispatch } from 'react-redux';
import GetLocationWithUserInput from './GetLocationWithUserInput';
import GetUserLocation from './GetUserLocation';
const OpenLayersMap = () => {
    const dispatch = useDispatch()
    const geoJSONSource = '/data/deutschland.geojson';
    const ortCentroid = "06406"
    const ortInfoRef = useRef('');
    let positionFeature = new Feature();
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();

    useEffect(() => {
        const map = new Map({
            target: mapDivRef.current as HTMLDivElement,
            layers: [new TileLayer({
                source: new OSM(),
            })],
            view: new View({
                center: [0, 0],
                zoom: 10
            })
        })
        setOlMap(map)
        getUserGeo(map, ortCentroid)
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
        if (feature !== undefined) {
            console.log(feature)
            dispatch({ type: 'plantInfo/setImageSrc', payload: TulpePic })
            feature.setStyle(newStyle)
        }
        console.log(feature?.getKeys())

    })
    olMap?.on('pointermove', (event) => {
        const hit = olMap.hasFeatureAtPixel(event.pixel);
        olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

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

    const getUserGeo = (map: Map, info: string) => {
        const userInfo = info.toLowerCase();
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
                const stadt = features
                    .filter((feature) =>
                        feature.values_.GEN.toLowerCase().includes(userInfo) || feature.values_.destatis?.zip === userInfo
                    )
                    .map((feature) => feature
                    );
                console.log("stadt: ", stadt)
                const point = stadt[0].getGeometry();
                console.log(point)
                getOrtCentroid(map, stadt[0])
            })
            .catch((err) => {
                console.error('❌ Fehler:', err.message);
            });
    }

    return <>
        <Card style={{ height: "80vh", width: "70vw", color: "#f2f7f5", backgroundColor: "#60935D" }}>
            <CardHeader>
                <div style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center"
                }}>
                    <Input placeholder="Geben Sie ein Ortname oder ein Postleitzahl" type="text" ref={ortInfoRef} style={{ color: "#f2f7f5" }} _placeholder={{ color: "#f2f7f5" }} />
                    <Tooltip label="Suchen" placement='top' hasArrow>
                        <Box>
                            <GetLocationWithUserInput olMap={olMap} getUserGeo={getUserGeo} ortInfoRef={ortInfoRef} />
                        </Box>
                    </Tooltip>

                    <Tooltip label="User Location" placement='top' hasArrow>

                        <Box>
                            <GetUserLocation olMap={olMap} positionFeature={positionFeature} />
                        </Box>
                    </Tooltip>
                </div>
            </CardHeader>
            <CardBody ref={mapDivRef}
                style={{ height: "80vh", width: "70vw" }}>
            </CardBody>
        </Card>
        <MapActions olMap={olMap} />
    </>
};

export default OpenLayersMap;