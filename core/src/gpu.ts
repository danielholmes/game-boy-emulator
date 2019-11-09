import { Mmu } from "./memory/mmu";
import { Screen } from "./screen";
import { ClockCycles } from "./cpu";
import { ByteValue } from "./types";

enum GpuMode {
  HBlank = 0,
  VBlank = 1,
  ScanlineOam = 2,
  ScanlineVRam = 3
}

class LcdControl {
  private _value: ByteValue;

  public constructor() {
    this._value = 0x91;
  }

  public get value(): ByteValue {
    return this._value;
  }
}

export class Gpu {
  private readonly mmu: Mmu;
  private readonly screen: Screen;
  private modeCycles: ClockCycles;
  private mode: GpuMode;
  private _control: LcdControl;

  public constructor(mmu: Mmu, screen: Screen) {
    this.mmu = mmu;
    this.screen = screen;
    this.modeCycles = 0;
    this.mode = GpuMode.ScanlineOam;
    this._control = new LcdControl();
  }

  public get control(): LcdControl {
    return this._control;
  }

  public tick(cycles: ClockCycles): void {
    this.modeCycles += cycles;

    switch (this.mode) {
      case GpuMode.ScanlineOam:
        this.scanlineOamTick();
        break;
      case GpuMode.ScanlineVRam:
        this.scanlineVRamTick();
        break;
      case GpuMode.HBlank:
        this.hBlankTick();
        break;
      case GpuMode.VBlank:
        this.vBlankTick();
        break;
    }

    // # Mode 2
    //   self.setSTATMode(2)
    //   self.calculateCycles(80)
    //
    // # Mode 3
    //   self.setSTATMode(3)
    //   self.calculateCycles(170)
    //
    //   self.MainWindow.scanline(y, self.lcd)
    //
    // # Mode 0
    //   self.setSTATMode(0)
    //   self.calculateCycles(206)
    //
    //   self.cpu.setInterruptFlag(self.cpu.VBlank)
  }

  private scanlineOamTick(): void {
    // TODO: Work
    if (this.modeCycles >= 80) {
      this.mode = GpuMode.ScanlineVRam;
      this.modeCycles = this.modeCycles - 80;
    }
  }

  private scanlineVRamTick(): void {
    // TODO: Work
    if (this.modeCycles >= 170) {
      this.mode = GpuMode.HBlank;
      this.modeCycles = this.modeCycles - 170;
    }
  }

  private hBlankTick(): void {
    // TODO: Work
    if (this.modeCycles >= 206) {
      this.mode = GpuMode.VBlank;
      this.modeCycles = this.modeCycles - 206;
    }
  }

  private vBlankTick(): void {
    // throw new Error('VBlank')
    this.mode = GpuMode.ScanlineOam;
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
