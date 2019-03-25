import React, { Component, ReactElement } from "react";
import { Tile } from "@gebby/core";
import TileMapTile from "./TileMapTile";

interface TileMapProps {
  readonly tiles: ReadonlyArray<Tile>;
}

export default class TileMap extends Component<TileMapProps> {
  public render(): ReactElement<TileMapProps> {
    return (
      <div className="tile-map">
        <h3>Tile Map</h3>
        {this.props.tiles.map((tile, i) => (
          <TileMapTile key={i} index={i} tile={tile}/>
        ))}
      </div>
    )
  }
}
