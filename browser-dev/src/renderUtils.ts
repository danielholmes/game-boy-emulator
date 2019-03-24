import { Tile } from "@gebby/core";

export const drawTileToCanvas = (imageData: ImageData, tile: Tile): void => {
  const BYTES_PER_PIXEL = 4;
  tile.forEach((r, y) =>
    r.forEach((c, x) => {
      switch (c) {
        case 3:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 2:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 1:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 0:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
      }
    })
  );
}
