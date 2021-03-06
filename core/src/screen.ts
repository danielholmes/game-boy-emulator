import { PixelColor } from "./types";

export interface Screen {
  setPixel(x: number, y: number, pixelColor: PixelColor): void;
}

export const DIMENSIONS = { width: 160, height: 144 };
