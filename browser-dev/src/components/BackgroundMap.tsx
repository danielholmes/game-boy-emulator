import React, { Component, ReactElement } from "react";
import { drawTileToCanvas } from "../utils/utils";
import { isEqual } from "lodash";
import { BackgroundMap as CoreBackgroundMap, TileDataIndex, VRam } from "@gebby/core";

interface BackgroundMapProps {
  readonly bgMap: CoreBackgroundMap;
  readonly vRam: VRam;
}

export default class BackgroundMap extends Component<BackgroundMapProps> {
  private canvas?: HTMLCanvasElement;

  private tileCanvas: HTMLCanvasElement;

  public constructor(props: BackgroundMapProps) {
    super(props);
    this.tileCanvas = document.createElement("canvas");
    this.tileCanvas.width = 8;
    this.tileCanvas.height = 8;
  }

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

    const tileContext = this.tileCanvas.getContext("2d");
    if (!tileContext) {
      throw new Error("2d");
    }
    this.props
      .bgMap
      .forEach((row: ReadonlyArray<TileDataIndex>, y: number) =>
        row.forEach((c, x: number) => {
          tileContext.clearRect(0, 0, this.tileCanvas.width, this.tileCanvas.height)
          const tData = tileContext.getImageData(0, 0, this.tileCanvas.width, this.tileCanvas.height)
          drawTileToCanvas(tData, this.props.vRam.getTileDataFromTable1(c))
          context.putImageData(tData, x * 8, y * 8);
        })
      );
  }

  public componentDidUpdate (prevProps: Readonly<BackgroundMapProps>): void {
    if (!isEqual(prevProps.bgMap, this.props.bgMap)) {
      this.renderCanvas();
    }
  }

  public render(): ReactElement<BackgroundMapProps> {
    return (
      <div className="background-map">
        <h3>Background Map</h3>
        <canvas
          ref={this.onCanvasRef.bind(this)}
          style={{ border: "1px solid black", width: 512, height: 512 }}
          width={256}
          height={256}
        />
      </div>
    );
  }
}
