export type PixelColor = 0 | 1 | 2 | 3; // off (white) -> on/black

export interface Screen {
  setPixel(x: number, y: number, pixelColor: PixelColor): void;
}

export const DIMENSIONS = { width: 160, height: 144 }
