import React, { Component, ReactElement } from "react";
import { ByteValue, Device, toByteHexString, TileMap } from "@gebby/core";
import PanelLayout from "./PanelLayout";
import { range } from "lodash";
import {
  CanvasPackage,
  createOpaqueCanvasContextPackage,
  drawTileToImageData
} from "../utils/utils";

interface TileMapPanelProps {
  readonly device: Device;
  readonly map: 1 | 2;
}

const DIMENSION_VALUES: readonly ByteValue[] = range(0x00, 0xff + 1, 0x10);
const BORDER_SIZE = 1;
const BORDER_POSITIONS: readonly number[] = range(
  0x08,
  16 * (0x08 + BORDER_SIZE) + 1,
  0x08 + BORDER_SIZE
);

const BORDERED_TILE_MAP_SIZE = 16 * (BORDER_SIZE + 8);

class TileMapPanel extends Component<TileMapPanelProps> {
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
    const { imageData, context } = this.canvasPackage;

    const tileMap: TileMap =
      this.props.map === 1
        ? this.props.device.vRam.tileMap1
        : this.props.device.vRam.tileMap2;
    tileMap.forEach((tile, i) => {
      drawTileToImageData(
        imageData,
        tile,
        (i % 0x10) * (BORDER_SIZE + 8),
        Math.floor(i / 0x10) * (BORDER_SIZE + 8)
      );
    });
    context.putImageData(imageData, 0, 0);
    context.strokeStyle = "black";
    context.fillStyle = "black";
    BORDER_POSITIONS.forEach(y => {
      context.fillRect(0, y, BORDERED_TILE_MAP_SIZE, BORDER_SIZE);
    });
    BORDER_POSITIONS.forEach(x => {
      context.fillRect(x, 0, BORDER_SIZE, BORDERED_TILE_MAP_SIZE);
    });
  }

  public componentDidUpdate(): void {
    this.renderCanvas();
  }

  public render(): ReactElement<TileMapPanelProps> {
    return (
      <PanelLayout title={`VRam Tile Map ${this.props.map}`}>
        <div>
          <table className="tile-map">
            <thead>
              <tr>
                <th />
                {DIMENSION_VALUES.map(i => (
                  <th key={i}>{toByteHexString(i)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DIMENSION_VALUES.map(i => (
                <tr key={i}>
                  <td>{toByteHexString(i)}</td>
                  {i === 0x00 && (
                    <td
                      colSpan={DIMENSION_VALUES.length}
                      rowSpan={DIMENSION_VALUES.length}
                    >
                      <canvas
                        ref={this.onCanvasRef.bind(this)}
                        width={BORDERED_TILE_MAP_SIZE}
                        height={BORDERED_TILE_MAP_SIZE}
                        style={{
                          width: BORDERED_TILE_MAP_SIZE * 2,
                          height: BORDERED_TILE_MAP_SIZE * 2
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelLayout>
    );
  }
}

type NumTileMapPanelProps = Pick<
  TileMapPanelProps,
  Exclude<keyof TileMapPanelProps, "map">
>;

const TileMapPanel1 = (
  props: NumTileMapPanelProps
): ReactElement<NumTileMapPanelProps> => <TileMapPanel map={1} {...props} />;

const TileMapPanel2 = (
  props: NumTileMapPanelProps
): ReactElement<NumTileMapPanelProps> => <TileMapPanel map={2} {...props} />;

export { TileMapPanel1, TileMapPanel2 };
