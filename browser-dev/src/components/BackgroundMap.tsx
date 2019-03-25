import React, { Component, ReactElement } from "react";
import { drawTileToCanvas } from "../utils/utils";
import { TileDataIndex, VRam } from "@gebby/core";
import PanelLayout from "./PanelLayout";

interface BackgroundMapProps {
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
      .vRam
      .bgMap1
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
    // TODO
    //if (!isEqual(prevProps.bgMap, this.props.bgMap)) {
      this.renderCanvas();
    //}
  }

  public render(): ReactElement<BackgroundMapProps> {
    return (
      <PanelLayout title='VRam BackgroundMap'>
        <canvas
          ref={this.onCanvasRef.bind(this)}
          style={{ border: "1px solid black", width: 512, height: 512 }}
          width={256}
          height={256}
        />
      </PanelLayout>
    );
  }
}
