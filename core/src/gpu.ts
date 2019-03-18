import { Mmu } from './memory/mmu'

export class Gpu {
  private readonly mmu: Mmu;
  private readonly screen: Screen;

  public constructor(mmu: Mmu, screen: Screen)
  {
    this.mmu = mmu;
    this.screen = screen;
  }

  // VRam
  // 8000-87FF	Tile set #1: tiles 0-127
  // 8800-8FFF	Tile set #1: tiles 128-255, Tile set #0: tiles -1 to -128
  // 9000-97FF	Tile set #0: tiles 0-127
  // 9800-9BFF	Tile map #0
  // 9C00-9FFF	Tile map #1

  // IO Registers
  // FF42 - SCY - Scroll Y (R/W)
  // FF43 - SCX - Scroll X (R/W)
  // Specifies the position in the 256x256 pixels BG map (32x32 tiles) which is to be displayed at the upper/left LCD display position.
  // Values in range from 0-255 may be used for X/Y each, the video controller automatically wraps back to the upper (left) position in BG map when drawing exceeds the lower (right) border of the BG map area.
  //
  // FF44 - LY - LCDC Y-Coordinate (R)
  // The LY indicates the vertical line to which the present data is transferred to the LCD Driver. The LY can take on any value between 0 through 153. The values between 144 and 153 indicate the V-Blank period. Writing will reset the counter.
  //
  // FF45 - LYC - LY Compare (R/W)
  // The gameboy permanently compares the value of the LYC and LY registers. When both values are identical, the coincident bit in the STAT register becomes set, and (if enabled) a STAT interrupt is requested.
  //
  // FF4A - WY - Window Y Position (R/W)
  // FF4B - WX - Window X Position minus 7 (R/W)
  // Specifies the upper/left positions of the Window area. (The window is an alternate background area which can be displayed above of the normal background. OBJs (sprites) may be still displayed above or behinf the window, just as for normal BG.)
  // The window becomes visible (if enabled) when
}
