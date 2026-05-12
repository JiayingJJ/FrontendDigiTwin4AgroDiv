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
import { Card, CardHeader, CardBody, VStack, HStack, Button } from '@chakra-ui/react'
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
import AddDataInTable from './AddDataInTable';
import { fetchTableWithId, getColumnWithId, getGeoData } from '../../api/dataset';
import CircleStyle from 'ol/style/Circle';
import RendernInfo from './DatasetsInMaps/RendernInfo';

const OpenLayersMap = () => {
    const dispatch = useDispatch()
    const geoJSONSource = '/data/deutschland.geojson';
    const ortCentroid = "06406"
    const ortInfoRef = useRef('');
    let positionFeature = new Feature();
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
    const rendernDataInfo = useSelector((state: any) => state.openLayers.rendernDataInfo)

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
        // map.addLayer(vectorLayer)
        return () => map.setTarget(undefined);
    }, [])

    const vectorSourceUserData = useRef(new VectorSource());
    const vectorLayerUserData = useRef(new VectorLayer({
        source: vectorSourceUserData.current,
        visible: true,
        style: (feature) => {
            const geometryType = feature.getGeometry()?.getType();

            if (geometryType === 'Point' || geometryType === 'MultiPoint') {
                return new Style({
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
                });
            }
            if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
                return new Style({
                    stroke: new Stroke({ color: 'blue', width: 1, lineDash: [30, 10] }),
                });
            }
            if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
                return new Style({
                    stroke: new Stroke({ color: 'blue', width: 1, lineDash: [30, 10] }),
                    fill: new Fill({ color: 'rgba(0, 255, 0, 0.3)' }),
                });
            }
        }
    }));

    const backendToGeoJSON = (data: any[]) => {
        const features = data
            .filter(item => item.GeometryData.Valid)
            .map(item => ({
                type: "Feature",
                geometry: item.GeometryData.RawMessage,
                properties: { id: item.Properties }
            }));

        return {
            type: "FeatureCollection",
            features: features
        };
    };

    useEffect(() => {
        const fetchUserGeoData = async () => {
            const data = await getGeoData();
            const geoJsonData = backendToGeoJSON(data);
            console.log('GeoJSON:', geoJsonData);

            const format = new GeoJSON();
            const features = format.readFeatures(geoJsonData, {
                dataProjection: 'EPSG:3857',
                featureProjection: 'EPSG:3857'
            });

            vectorSourceUserData.current.clear();
            vectorSourceUserData.current.addFeatures(features);
        };

        fetchUserGeoData();
    }, []);

    const showGeoJSON = () => {
        if (!olMap) return;
        const layers = olMap.getLayers().getArray();
        const exists = layers.includes(vectorLayerUserData.current);
        if (!exists) {
            olMap.addLayer(vectorLayerUserData.current);
        }
    };

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
    const isDrawing = useSelector((state: any) => state.openLayers.drawingInteraction)
    const isDrawingRef = useRef(isDrawing);
    const fetchDataForDrawed = async (tableId: string, id: string) => {
        const dataColumn = await getColumnWithId(tableId, id)
        const dataTable = await fetchTableWithId(tableId)
        dispatch({ type: 'openLayers/setColumnInfo', payload: dataColumn })
        dispatch({ type: 'openLayers/setTableInfo', payload: dataTable[0] })
        dispatch({ type: 'openLayers/setRendernDataInfo', payload: true })
    }
    useEffect(() => {
        isDrawingRef.current = isDrawing;
    }, [isDrawing]);
    olMap?.on('click', (e) => {
        if (isDrawingRef.current === true) {
            return
        } else {
            const feature = olMap.forEachFeatureAtPixel(e.pixel, (f) => f)
            if (feature !== undefined) {
                const dataId = feature.values_.id;
                if (dataId !== undefined) {
                    fetchDataForDrawed(dataId.RawMessage.table_id, dataId.RawMessage.column_id)
                    dispatch({ type: 'openLayers/setTableIdForDrawed', payload: dataId.RawMessage.table_id })
                    dispatch({ type: 'openLayers/setColumnIdForDrawed', payload: dataId.RawMessage.column_id })
                } else {
                    dispatch({ type: 'openLayers/setAddDrawedInteractionInfo', payload: true })
                }
                // feature.setStyle(newStyle)
            }
        }
    })
    olMap?.on('pointermove', (event) => {
        const hit = olMap.hasFeatureAtPixel(event.pixel);
        olMap.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });


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
                const point = stadt[0].getGeometry();
                getOrtCentroid(map, stadt[0])
            })
            .catch((err) => {
                console.error('Fehler:', err.message);
            });
    }

    return <HStack>
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
        <VStack>
            <MapActions olMap={olMap} />
            {addDrawedInteractionInfo && <AddDataInTable />}
            {rendernDataInfo && <RendernInfo />}
        </VStack>
        <Button onClick={showGeoJSON}>Click</Button>
    </HStack>
};

export default OpenLayersMap;