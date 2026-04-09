import * as React from 'react';
import { FiPlusCircle } from "react-icons/fi";
import { BsWater } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import { MdCameraOutdoor } from "react-icons/md";
import { MdTerrain } from "react-icons/md";
import { Tooltip, Box } from '@chakra-ui/react'
import { Map } from 'ol';
import DrawMap from './DrawMap';
import TileLayer from 'ol/layer/Tile';
import StadiaMaps from 'ol/source/StadiaMaps.js';
import { OSM } from 'ol/source';
import { useDispatch } from 'react-redux';

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
  return (
    <div style={{ display: 'flex', justifyContent: "center" }}>
      <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => {
        console.log("click")
        return (
          <DrawMap olMap={olMap} />
        )
      }} />
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
    </div>
  );
};

export default MapActions;
