import { BackgroundMap, Tile, TileMap } from "@gebby/core";
import { range } from "lodash";

const BYTES_PER_PIXEL = 4;
const TILE_DIMENSION = 8;

const createOpaqueImageData = (width: number, height: number): ImageData => {
  const imageData = new ImageData(width, height);
  range(0, height).forEach(y =>
    range(0, width).forEach(x => {
      const index = (y * width + x) * BYTES_PER_PIXEL;
      imageData.data.fill(0xff, index, index + 4);
    })
  );
  return imageData;
};

export interface CanvasPackage {
  readonly canvas: HTMLCanvasElement;
  readonly imageData: ImageData;
  readonly context: CanvasRenderingContext2D;
}

export const createOpaqueCanvasContextPackage = (
  canvas: HTMLCanvasElement
): CanvasPackage => {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No 2d");
  }
  context.imageSmoothingEnabled = false;
  //context.translate(0.5, 0.5);
  return {
    canvas,
    context,
    imageData: createOpaqueImageData(canvas.width, canvas.height)
  };
};

export const drawTileToImageData = (
  imageData: ImageData,
  tile: Tile,
  canvasOffsetX: number = 0,
  canvasOffsetY: number = 0
): void => {
  tile.forEach((row, y) => {
    const rowPixelIndex = (y + canvasOffsetY) * imageData.width;
    row.forEach((color, x) => {
      const baseIndex = (rowPixelIndex + x + canvasOffsetX) * BYTES_PER_PIXEL;
      //console.log(x, canvasOffsetX);
      // TODO: I think this needs to be fed through a palette
      switch (color) {
        case 3:
          imageData.data.fill(0x00, baseIndex, baseIndex + 3);
          break;
        case 2:
          imageData.data.fill(0x55, baseIndex, baseIndex + 3);
          break;
        case 1:
          imageData.data.fill(0xaa, baseIndex, baseIndex + 3);
          break;
        case 0:
          imageData.data.fill(0xff, baseIndex, baseIndex + 3);
          break;
      }
    });
  });
};

export const drawBackgroundToImageData = (
  imageData: ImageData,
  bgMap: BackgroundMap,
  tileMap: TileMap,
  screenX: number = 0,
  screenY: number = 0
): void => {
  bgMap.forEach((row, y) =>
    row.forEach((c, x) =>
      drawTileToImageData(
        imageData,
        tileMap[c],
        // screenX and screenY might need to be taken away instead
        screenX + x * TILE_DIMENSION,
        screenY + y * TILE_DIMENSION
      )
    )
  );
};
