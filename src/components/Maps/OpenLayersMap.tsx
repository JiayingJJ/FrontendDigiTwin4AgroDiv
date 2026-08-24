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
import { Card, CardHeader, CardBody, VStack, HStack, Button, CardFooter } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import { Input, Box } from '@chakra-ui/react'
// Rest
import * as turf from '@turf/turf';
// Components
import MapActions from './MapActions';
import { useSelector, useDispatch } from 'react-redux';
import GetLocationWithUserInput from './GetLocationWithUserInput';
import GetUserLocation from './GetUserLocation';
import CircleStyle from 'ol/style/Circle';
import { getGeoData, getGeoDataWithUserId } from '../../api/geoData';
import { getColumnWithId } from '../../api/dataset';
import DataUserLayer from './DataUserLayer';
import { deepEqual } from '../../helpers';
import { renderToStaticMarkup } from "react-dom/server";
import { MdPushPin } from "react-icons/md";
const OpenLayersMap = () => {
    const dispatch = useDispatch()
    const geoJSONSource = '/data/deutschland.geojson';
    const ortCentroid = "06406"
    const ortInfoRef = useRef('');
    let positionFeature = new Feature();
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const geoDataFromRedux = useSelector((state: any) => state.openLayers.geoData)
    const userInfo = useSelector((state: any) => state.user)
    const selectedGeometryDataFromDatabase = useSelector((state: any) => state.openLayers.selectedGeometryDataFromDatabase)
    const showUserDataLayer = useSelector((state: any) => state.openLayers.showUserDataLayer)
    const layerType = useSelector((state: any) => state.openLayers.layerType)
    const selectedPropertiesFromDatabase = useSelector((state: any) => state.openLayers.selectedPropertiesFromDatabase)
    const geometryFromRedux = useSelector((state: any) => state.openLayers.geometry)
    const colorRedux = useSelector((state: any) => state.openLayers.userSelectedColor)
    const featureRedux = useSelector((state: any) => state.openLayers.feature)
    const isDrawing = useSelector((state: any) => state.openLayers.drawingInteraction)
    const getUpdateFromDatabase = useSelector((state: any) => state.openLayers.getUpdateFromDatabase)
    const selectedGeoData = useSelector((state: any) => state.openLayers.selectedGeoData)
    const rendernGeoDataList = useSelector((state: any) => state.openLayers.rendernGeoDataList)
    const isDrawingRef = useRef(isDrawing);
    const cardPadding = "0.4rem";
    const strockeColor = "#fff";
    const missedStrockeColor = "#ba2d0bff";

    const vectorSourceUserData = useRef(new VectorSource());
    const vectorLayerUserData = useRef(new VectorLayer({
        source: vectorSourceUserData.current,
        visible: true
    }));
    const svgString = renderToStaticMarkup(<MdPushPin color='#ba2d0bff' size={40} />);
    const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    const backendToGeoJSON = (data: any[]) => {
        const features = data
            .filter(item => item.geometry_data.Valid)
            .map(item => ({
                type: "Feature",
                geometry: item.geometry_data.RawMessage,
                properties: { ids: item.properties }
            }));

        return {
            type: "FeatureCollection",
            features: features
        };
    };

    const statusForUserDataLayer = () => {
        if (!olMap) return;
        if (showUserDataLayer) {
            const layers = olMap.getLayers().getArray();
            const exists = layers.includes(vectorLayerUserData.current);
            if (!exists) {
                olMap.addLayer(vectorLayerUserData.current);
            }
        } else {
            olMap?.removeLayer(vectorLayerUserData.current);
        }
    }

    const fetchDataForDrawed = async (id: string) => {
        const geoId = geoDataFromRedux.filter((i: any) => i.id === id)
        if (geoId.length !== 0) {
            dispatch({ type: 'openLayers/setSelectedGeoData', payload: geoId[0] })
            dispatch({ type: 'openLayers/setSelectedGeometryDataFromDatabase', payload: geoId[0].geometry_data.RawMessage })
            dispatch({ type: 'openLayers/setSelectedPropertiesDataFromDatabase', payload: geoId[0].properties.RawMessage })
            dispatch({ type: 'openLayers/setSelectedGeoInfo', payload: { id: geoId[0].id, data_status: geoId[0].data_status } })
            if (geoId[0].properties.RawMessage[0] === undefined) {
                dispatch({ type: 'openLayers/setUserSelectedColor', payload: geoId[0].properties.RawMessage.color })
            } else {
                dispatch({ type: 'openLayers/setUserSelectedColor', payload: geoId[0].properties.RawMessage[0].color })
            }
        }
        dispatch({ type: 'openLayers/setRendernGeoDataList', payload: true })
    }
    const getOrtCentroid = (map: Map, feature: Feature) => {
        const coordinates = feature.getGeometry().getCoordinates();
        const turfPolygon = {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: coordinates
            }
        };
        const centroid = turf.centroid(turfPolygon);
        positionFeature?.setGeometry(new Point(centroid.geometry.coordinates))
        map?.getView().fit(positionFeature.getGeometry(), { padding: [170, 50, 30, 150], minResolution: 50 })
        map?.getView().setZoom(13)
    }

    const getUserGeo = (map: Map, info: string) => {
        const userInfo = info.toLowerCase();
        fetch(`${geoJSONSource}`)
            .then((res) => {
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
                const point = stadt[0].getGeometry();
                getOrtCentroid(map, stadt[0])
            })
            .catch((err) => {
                console.error('Fehler:', err.message);
            });
    }
    const getDataInProperties = async () => {
        if (selectedPropertiesFromDatabase.length !== undefined) {
            await Promise.all(
                selectedPropertiesFromDatabase.map(async (proper: any) => {
                    if (proper.table_id !== undefined) {
                        const data = await getColumnWithId(proper.table_id, proper.column_id);
                        dispatch({ type: 'openLayers/addAllInfoInProperties', payload: data });
                    }
                })
            );
        }
    };
    olMap?.on('click', (e) => {
        if (isDrawingRef.current === true) {
            return
        }
        else {
            dispatch({ type: 'openLayers/clearReduxForGeoData', payload: [] })
            const feature = olMap.forEachFeatureAtPixel(e.pixel, (f) => f)
            if (feature !== undefined) {
                dispatch({ type: 'openLayers/setFeature', payload: feature })
                const dataId = feature.values_.ids;
                if (dataId !== undefined && dataId.Valid === true) {
                    const raw = dataId?.RawMessage;
                    const id =
                        Array.isArray(raw)
                            ? raw?.[0]?.id
                            : raw?.id;
                    if (!id) throw new Error("id not found");
                    fetchDataForDrawed(id);
                } else {
                    dispatch({ type: 'openLayers/setGeometry', payload: feature.getGeometry().getCoordinates() })
                    dispatch({ type: 'openLayers/setGeometryType', payload: feature.getGeometry()?.getType() })
                    if (dataId === undefined || dataId.Valid === false) {
                        if (geoDataFromRedux.length !== 0) {
                            geoDataFromRedux.forEach((gd: any) => {
                                const rawCoords = gd.geometry_data.RawMessage.coordinates;
                                const dbCoords = geometryFromRedux;
                                if (
                                    deepEqual(rawCoords, dbCoords)
                                ) {
                                    dispatch({ type: 'openLayers/setSelectedPropertiesDataFromDatabase', payload: { id: gd.id, data_status: gd.data_status } })
                                    dispatch({ type: 'openLayers/setSelectedGeoInfo', payload: { id: gd.id, data_status: gd.data_status } })
                                    dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: true })
                                } else {
                                    dispatch({ type: 'openLayers/setSelectedGeoInfo', payload: { id: null, data_status: "pending" } })
                                    dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: true })
                                    dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: true })
                                }
                                dispatch({ type: 'openLayers/setRendernGeoDataList', payload: true })
                            });
                        } else {
                            dispatch({ type: 'openLayers/setSelectedGeoInfo', payload: { id: null, data_status: "pending" } })
                            dispatch({ type: 'openLayers/setAddNewColumnsDataInGeometry', payload: true })
                            dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: true })
                        }
                    }
                }
                // feature.setStyle(newStyle)
            }
        }
    })
    olMap?.on('pointermove', (event) => {
        const hit = olMap.hasFeatureAtPixel(event.pixel);
        olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    useEffect(() => {
        isDrawingRef.current = isDrawing;
    }, [isDrawing]);
    const resetFeatures = (features: any) => {
        features.forEach((feature) => {
            const data = feature.values_.ids
            if (data !== undefined && data.Valid === true) {
                let userColor;
                let stroke;
                const raw = data?.RawMessage;
                userColor =
                    Array.isArray(raw)
                        ? raw?.[0]?.color
                        : raw?.color;
                if (userColor === undefined || userColor === "") {
                    userColor = "#fff";
                    stroke = missedStrockeColor;
                } else {
                    stroke = strockeColor;
                }
                if (feature.getGeometry()?.getType() === "Point") {
                    feature.setStyle(
                        new Style({
                            image: new CircleStyle({
                                radius: 10,
                                fill: new Fill({ color: userColor }),
                                stroke: new Stroke({ color: stroke, width: 2 }),
                            }),
                        })
                    );
                } else if (feature.getGeometry()?.getType() === "Polygon") {
                    feature.setStyle(
                        new Style({
                            stroke: new Stroke({ color: stroke, width: 2 }),
                            fill: new Fill({ color: userColor }),
                        })
                    );
                }
            } else {
                feature.setStyle(null)
            }
        })
    }
    const fetchUserGeoData = async () => {
        const data = await getGeoData();
        // Get geo_data with UserId
        const geoDataUserId = await getGeoDataWithUserId(userInfo.id);
        const validData = data.filter((d: any) => {
            if (!d.deleted_at.Valid) {
                return d;
            }
        })
        dispatch({ type: 'openLayers/setGeodata', payload: validData })
        const geoJsonData = backendToGeoJSON(validData);
        dispatch({ type: 'openLayers/setGeoJsonData', payload: geoJsonData })
        const format = new GeoJSON();
        const features = format.readFeatures(geoJsonData, {
            dataProjection: 'EPSG:3857',
            featureProjection: 'EPSG:3857'
        });

        vectorSourceUserData.current.clear();
        vectorSourceUserData.current.addFeatures(features);
        resetFeatures(features)
    };
    useEffect(() => {
        dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
        fetchUserGeoData();
    }, []);
    useEffect(() => {
        dispatch({ type: 'openLayers/clearAllForGeoData', payload: null })
        dispatch({ type: 'openLayers/setRendernDataInfo', payload: false })
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
        // map.addLayer(vectorLayer)
        return () => map.setTarget(undefined);
    }, [])
    useEffect(() => {
        statusForUserDataLayer()
    }, [layerType, showUserDataLayer, getUpdateFromDatabase])
    useEffect(() => {
        let userColor;
        const features = vectorSourceUserData.current.getFeatures();
        resetFeatures(features)
        if (colorRedux === undefined || colorRedux === "" || colorRedux === null) {
            userColor = "#fff";
        } else {
            userColor = colorRedux
        }
        if (featureRedux !== null) {
            if (featureRedux.getGeometry()?.getType() === "Point") {
                featureRedux.setStyle(
                    [new Style({
                        image: new CircleStyle({
                            radius: 10,
                            fill: new Fill({ color: userColor }),
                            stroke: new Stroke({ color: strockeColor, width: 2 }),
                        }),
                    }),
                    new Style({
                        image: new Icon({
                            src: dataUrl,
                            color: "red",
                            scale: 1,
                            anchor: [0.5, 1],
                        })
                    })
                    ]
                );
            } else if (featureRedux.getGeometry()?.getType() === "Polygon") {
                featureRedux.setStyle(
                    [new Style({

                        stroke: new Stroke({ color: strockeColor, width: 2 }),
                        fill: new Fill({ color: userColor }),
                    }),
                    new Style({
                        image: new Icon({
                            src: dataUrl,
                            scale: 1,
                            anchor: [0.5, 1],
                        }),
                        geometry: featureRedux => featureRedux.getGeometry().getInteriorPoint(),
                    })
                    ]
                );
            }
        } else {
            fetchUserGeoData()
        }
    }, [featureRedux])
    useEffect(() => {
        let userColor;
        const features = vectorSourceUserData.current.getFeatures();
        if (colorRedux === undefined || colorRedux === "" || colorRedux === null) {
            userColor = "#fff";
        } else {
            userColor = colorRedux;
        }
        resetFeatures(features)
        if (featureRedux !== null) {
            if (featureRedux.getGeometry()?.getType() === "Point") {
                featureRedux.setStyle(
                    [new Style({
                        image: new CircleStyle({
                            radius: 10,
                            fill: new Fill({ color: userColor }),
                            stroke: new Stroke({ color: strockeColor, width: 2 }),
                        }),
                    }),
                    new Style({
                        image: new Icon({
                            src: dataUrl,
                            color: "red",
                            scale: 1,
                            anchor: [0.5, 1],
                        })
                    })
                    ]
                );
            } else if (featureRedux.getGeometry()?.getType() === "Polygon") {
                featureRedux.setStyle(
                    [new Style({

                        stroke: new Stroke({ color: strockeColor, width: 2 }),
                        fill: new Fill({ color: userColor }),
                    }),
                    new Style({
                        image: new Icon({
                            src: dataUrl,
                            scale: 1,
                            anchor: [0.5, 1],
                        }),
                        geometry: featureRedux => featureRedux.getGeometry().getInteriorPoint(),
                    })
                    ]
                );
            }
        }

    }, [colorRedux])

    useEffect(() => {
        if (!rendernGeoDataList) {
            console.log(featureRedux)
            if (featureRedux !== null) {
                resetFeatures([featureRedux])
            }
            dispatch({ type: 'openLayers/setFeature', payload: null })
        }
    }, [rendernGeoDataList])
    useEffect(() => {
        if (selectedGeometryDataFromDatabase !== null) {
            getDataInProperties()
        }
    }, [selectedGeometryDataFromDatabase])

    useEffect(() => {
        if (getUpdateFromDatabase) {
            fetchUserGeoData();
            if (selectedGeoData !== null && selectedGeoData.id !== null) {
                fetchDataForDrawed(selectedGeoData.id);
            }
            getDataInProperties()
            const features = vectorSourceUserData.current.getFeatures();
            resetFeatures(features)
            dispatch({ type: 'openLayers/setRendernGeoDataList', payload: false })
            dispatch({ type: 'openLayers/setGetUpdateFromDatabase', payload: false })
        }
    }, [getUpdateFromDatabase])

    return <HStack width={"95vw"} height={"100%"} marginBottom={"0.5rem"}>
        <Card width={"95vw"} height={"100%"} style={{ color: "#f2f7f5", backgroundColor: "#60935D" }}>
            <CardBody ref={mapDivRef} padding={cardPadding}>
                <Box position={"absolute"} zIndex={10} pointerEvents={"none"} width={`calc(100% - 2*${cardPadding})`} height={`calc(100% - 2*${cardPadding})`}>
                    <Box position="relative" height={"100%"} width="100%" padding={"0.5rem"}>
                        <VStack height="100%" justifyContent={"space-between"}>
                            <HStack paddingLeft={"1.7rem"} width={"100%"} justifyContent={"space-between"}>
                                <Card borderRadius={"1rem"} opacity={"0.9"} pointerEvents={"auto"}>
                                    <CardBody padding={"0 .7rem"}>
                                        <HStack justifyContent="end" alignItems="center">
                                            <Input width={"100%"} minWidth={"20vw"} placeholder="Geben Sie ein Ortname oder ein Postleitzahl" type="text" ref={ortInfoRef} variant={"unstyled"} />
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
                                        </HStack>
                                    </CardBody>
                                </Card>
                                <Card borderRadius={"1rem"} opacity={"0.9"} pointerEvents={"auto"}>
                                    <CardBody padding={"0 .7rem"}>
                                        <HStack justifyContent="end" alignItems="center">
                                            <MapActions olMap={olMap} />
                                        </HStack>
                                    </CardBody>
                                </Card>
                            </HStack>

                            <DataUserLayer />
                        </VStack>
                    </Box>
                </Box>
            </CardBody>
        </Card>
    </HStack>
};

export default OpenLayersMap;