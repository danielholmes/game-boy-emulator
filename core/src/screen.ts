export type PixelColor = 0 | 1 | 2 | 3;

export interface Screen {
  writePixel(x: number, y: number, pixelColor: PixelColor): void;
}
