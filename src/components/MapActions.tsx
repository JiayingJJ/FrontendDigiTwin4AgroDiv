// @flow
import * as React from 'react';
// Icons
import { FiPlusCircle } from "react-icons/fi";
import { BsWater } from "react-icons/bs";
import { FaLayerGroup } from "react-icons/fa";
import { MdCameraOutdoor } from "react-icons/md";
import { MdTerrain } from "react-icons/md";
// Shadcn
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
type Props = {
  switchLayer: (layerType: string) => void
};
type State = {

};

const layerButtons = [
  { icon: FaLayerGroup, layerType: "standard", layerTooltip: "Standard-Karte" },
  { icon: BsWater, layerType: "stamen_watercolor", layerTooltip: "Aquarell-Optik" },
  { icon: MdCameraOutdoor, layerType: "outdoors", layerTooltip: "Outdoor-Karte" },
  { icon: MdTerrain, layerType: "stamen_terrain", layerTooltip: "Geländedarstellung" },
];
const MapActions = ({ switchLayer }: Props) => {

  return (
    <div style={{ display: 'flex', justifyContent: "center" }}>
      <FiPlusCircle style={{ padding: "5px", margin: "5px" }} size="30" onClick={() => console.log("click")} />
      {layerButtons.map(({ icon: Icon, layerType, layerTooltip }) => (
        <Tooltip key={`${layerType}-tooltip`}>
          <TooltipTrigger asChild>
            <Icon
              key={layerType}
              style={{ padding: "5px", margin: "5px" }}
              size="30"
              onClick={() => switchLayer(layerType)}
            />
          </TooltipTrigger>
          <TooltipContent>
            {layerTooltip}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default MapActions;
