import React, { ReactElement } from "react";
import { VRam } from "@gebby/core";
import TileMapTile from "./TileMapTile";
import { range } from "lodash";
import PanelLayout from "./PanelLayout";

interface TileMapProps {
  readonly vRam: VRam;
}

const TileMap = ({ vRam }: TileMapProps): ReactElement<TileMapProps> => {
  const tiles = range(0, 0x100).map((i) => vRam.getTileDataFromTable1(i));
  return (
    <PanelLayout title='VRam TileMap'>
      {tiles.map((tile, i) => (
        <TileMapTile key={i} index={i} tile={tile}/>
      ))}
    </PanelLayout>
  )
};

export default TileMap;
