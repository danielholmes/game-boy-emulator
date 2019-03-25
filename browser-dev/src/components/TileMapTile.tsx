import React, { Component, ReactElement } from "react";
import { Tile } from "@gebby/core";
import { isEqual } from "lodash";
import { drawTileToCanvas } from "../utils/utils";

interface TileMapTileProps {
  readonly index: number;
  readonly tile: Tile;
}

export default class TileMapTile extends Component<TileMapTileProps> {
  private canvas?: HTMLCanvasElement;

  private onCanvasRef(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.renderCanvas();
  }

  private renderCanvas(): void {
    if (!this.canvas) {
      return;
    }
    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("No 2d");
    }

    const tileImageData = context.getImageData(0, 0, this.canvas.width, this.canvas.height);

    drawTileToCanvas(tileImageData, this.props.tile);
    context.putImageData(tileImageData, 0, 0);
  }

  public componentDidUpdate (prevProps: Readonly<TileMapTileProps>): void {
    if (!isEqual(prevProps.tile, this.props.tile)) {
      this.renderCanvas();
    }
  }

  public render(): ReactElement<TileMapTileProps> {
    // TODO: Display hex and decimal number when rollover
    // <h4>{this.props.index}</h4>
    return (
      <canvas
        ref={this.onCanvasRef.bind(this)}
        style={{ border: "1px solid black", width: 16, height: 16 }}
        width={8}
        height={8}
      />
    );
  }
}
