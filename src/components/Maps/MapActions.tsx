import * as React from 'react';
import { FiPlusCircle } from "react-icons/fi";
import { BsWater } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import { MdCameraOutdoor } from "react-icons/md";
import { MdTerrain } from "react-icons/md";
import { Tooltip, Box, HStack } from '@chakra-ui/react'
import { Map } from 'ol';
import TileLayer from 'ol/layer/Tile';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import { OSM } from 'ol/source';
import { useDispatch, useSelector } from 'react-redux';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Draw } from 'ol/interaction';
import { MdCancel } from "react-icons/md";
import Snap from 'ol/interaction/Snap.js';
import { useRef, useState } from 'react';
import { BiShapePolygon } from "react-icons/bi";
import { TbPoint } from "react-icons/tb";
import AddDataInTable from './AddDataInTable';
import RendernInfo from './DatasetsInMaps/RendernInfo';
type Props = {
  olMap: Map
};
type State = {

};

const layerButtons = [
  { icon: FaLayerGroup, layerType: "standard", layerTooltip: "Standard-Karte" },
  { icon: BsWater, layerType: "stamen_watercolor", layerTooltip: "Aquarell-Optik" },
  { icon: MdCameraOutdoor, layerType: "outdoors", layerTooltip: "Outdoor-Karte" },
  { icon: MdTerrain, layerType: "stamen_terrain", layerTooltip: "Geländedarstellung" },
];
const MapActions = ({ olMap }: Props) => {
  const dispatch = useDispatch()
  const addDrawedInteractionInfo = useSelector((state: any) => state.openLayers.addDrawedInteractionInfo)
  const rendernDataInfo = useSelector((state: any) => state.openLayers.rendernDataInfo)
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
  const drawRef = useRef<Draw>(null)
  const snapRef = useRef<Snap | null>(null);
  const sourceRef = useRef<VectorSource>(new VectorSource({ wrapX: false }));
  const vectorRef = useRef<VectorLayer | null>(null);

  const removeDrawInteraction = () => {
    if (drawRef.current) {
      drawRef.current.abortDrawing();
      drawRef.current.setActive(false);
      olMap?.removeInteraction(drawRef.current);
      drawRef.current = null;
    }

    if (snapRef.current) {
      olMap?.removeInteraction(snapRef.current);
      snapRef.current = null;
    }
  };

  const addInteractionInMap = (type: string) => {
    removeDrawInteraction();
    vectorRef.current = new VectorLayer({
      source: sourceRef.current,
    });
    olMap?.addLayer(vectorRef.current);
    const newDraw = new Draw({
      source: sourceRef.current,
      type: type
    });

    newDraw.on('drawstart', (event) => {
      console.log('Zeichnen gestartet:', event.feature);
    });

    newDraw.on('drawend', (event) => {
      const feature = event.feature;
      const geometry = feature.getGeometry();
      const type = geometry?.getType();
      const coordinates = geometry?.getCoordinates();
      dispatch({ type: 'openLayers/setGeometryType', payload: type })
      dispatch({ type: 'openLayers/setGeometry', payload: coordinates })

      // removeDrawInteraction();
      // dispatch({ type: 'openLayers/setDrawingInteraction', payload: false });
    });

    newDraw.on('drawabort', () => {
      console.log('drawabort');
      // removeDrawInteraction();
      // dispatch({ type: 'openLayers/setDrawingInteraction', payload: false });
    });

    drawRef.current = newDraw;
    olMap?.addInteraction(newDraw);

    const newSnap = new Snap({ source: sourceRef.current });
    snapRef.current = newSnap;
    olMap?.addInteraction(newSnap);
  };
  const [selectType, setSelectType] = useState<boolean>(false);
  return (
    <HStack style={{ display: 'flex', justifyContent: "center" }}>
      <Tooltip label={"Ein Punkt oder ein Polygon hinzufügen"} hasArrow >
        <Box>
          <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => {
            console.log("click")
            dispatch({ type: 'openLayers/setDrawingInteraction', payload: true })
            setSelectType(true)
          }} />
        </Box>
      </Tooltip>
      {selectType &&
        <Box style={{
          display: "flex",
        }}>
          <Tooltip label={"Ein Punkt hinzufügen"} hasArrow >
            <Box>
              <TbPoint style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => addInteractionInMap('Point')} />
            </Box>
          </Tooltip>
          <Tooltip label={"Ein Polygon hinzufügen"} hasArrow >
            <Box>
              <BiShapePolygon style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => addInteractionInMap('Polygon')} />
            </Box>
          </Tooltip>
          <Tooltip label={"Abbrechen"} hasArrow >
            <Box>
              <MdCancel style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => {
                console.log("click cancel")
                dispatch({ type: 'openLayers/setDrawingInteraction', payload: false })
                removeDrawInteraction()
                setSelectType(false)
              }} />
            </Box>
          </Tooltip>
        </Box>
      }

      {layerButtons.map(({ icon: Icon, layerType, layerTooltip }) => (
        <Tooltip key={`${layerType}-tooltip`} label={layerTooltip} hasArrow >
          <Box>
            <Icon
              key={layerType}
              style={{ padding: "5px", margin: "5px" }}
              size="30"
              onClick={() => switchLayer(layerType)}
            />
          </Box>
        </Tooltip>
      ))}
      {addDrawedInteractionInfo && <AddDataInTable />}
      {rendernDataInfo && <RendernInfo />}
    </HStack>
  );
};

export default MapActions;
