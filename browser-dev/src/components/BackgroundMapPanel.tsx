import React, { Component, ReactElement } from "react";
import {
  CanvasPackage,
  createOpaqueCanvasContextPackage,
  drawBackgroundToImageData
} from "../utils/utils";
import { Device } from "@gebby/core";
import PanelLayout from "./PanelLayout";

interface BackgroundMapPanelProps {
  readonly device: Device;
  readonly map: 1 | 2;
}

class BackgroundMapPanel extends Component<BackgroundMapPanelProps> {
  private canvasPackage?: CanvasPackage;

  private onCanvasRef(canvas: HTMLCanvasElement | null): void {
    if (!canvas) {
      return;
    }

    if (!this.canvasPackage || this.canvasPackage.canvas !== canvas) {
      this.canvasPackage = createOpaqueCanvasContextPackage(canvas);
      this.renderCanvas();
    }
  }

  private renderCanvas(): void {
    if (!this.canvasPackage) {
      return;
    }

    const bgMap =
      this.props.map === 1
        ? this.props.device.vRam.bgMap1
        : this.props.device.vRam.bgMap2;
    drawBackgroundToImageData(
      this.canvasPackage.imageData,
      bgMap,
      this.props.device.vRam.tileMap1
    );
    this.canvasPackage.context.putImageData(this.canvasPackage.imageData, 0, 0);
  }

  public componentDidUpdate(): void {
    // TODO
    //if (!isEqual(prevProps.bgMap, this.props.bgMap)) {
    this.renderCanvas();
    //}
  }

  public render(): ReactElement<BackgroundMapPanelProps> {
    return (
      <PanelLayout title="VRam BackgroundMap">
        <canvas
          ref={this.onCanvasRef.bind(this)}
          style={{ border: "1px solid black", width: 256 * 2, height: 256 * 2 }}
          width={256}
          height={256}
        />
      </PanelLayout>
    );
  }
}

type NumBackgroundMapPanelProps = Pick<
  BackgroundMapPanelProps,
  Exclude<keyof BackgroundMapPanelProps, "map">
>;

const BackgroundMapPanel1 = (
  props: NumBackgroundMapPanelProps
): ReactElement<NumBackgroundMapPanelProps> => (
  <BackgroundMapPanel map={1} {...props} />
);

const BackgroundMapPanel2 = (
  props: NumBackgroundMapPanelProps
): ReactElement<NumBackgroundMapPanelProps> => (
  <BackgroundMapPanel map={2} {...props} />
);

export { BackgroundMapPanel1, BackgroundMapPanel2 };
