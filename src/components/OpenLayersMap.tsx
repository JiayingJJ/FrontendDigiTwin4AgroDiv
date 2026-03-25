import { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import { OSM } from 'ol/source'
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';

const OpenLayersMap = () => {
    const mapDivRef = useRef<HTMLDivElement>(null)
    const [olMap, setOlMap] = useState<Map>();
    
    useEffect(() => {
        
    }, [])
    const getGeoDeu = () => {
        fetch('/data/countries/DEU.geo.json')
      .then((res) => {
        console.log('Response Status:', res.status); // 200 oder 404?
        if (!res.ok) throw new Error(`HTTP ${res.status} - Datei nicht gefunden!`);
        return res.json();
      })
      .then((geojsonData) => {
        console.log('✅ GeoJSON geladen:', geojsonData);

        const features = new GeoJSON().readFeatures(geojsonData, {
          featureProjection: 'EPSG:3857', // ✅ Wichtig!
        });
      const point = features[0].getGeometry();
      console.log(point)
      const coor = point?.getCoordinates();
      console.log(coor[0][0])

      olMap?.getView().setCenter(coor[0][10]);
        console.log(features)
        console.log(features)
        
        console.log('✅ Features:', features.length);
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
                center: [0,0],
                zoom: 5
            })
        })
        setOlMap(map)
        // map.getView().centerOn([41476986.91783319, 7840102.678377046], map.getSize() as any, [0, 0]);
        // map.getView().setZoom(5);
        return () => map.setTarget(undefined);
    }, [])
    
    return <div ref={mapDivRef} onClick={() => {
getGeoDeu()
    }} style={{ top: "100px", height: "80vh", width: "80vw" }} />;

};

export default OpenLayersMap;