import {
  ByteValue, ColorNumber,
  MemoryAddress,
  numberToHex,
  numberToWordHex
} from "../types";
import { range, chunk } from "lodash";

class Ram {
  protected readonly raw: Uint8Array;
  private readonly size: number;

  public constructor(size: number) {
    this.size = size;
    this.raw = new Uint8Array(this.size);
  }

  public getValues(): Uint8Array {
    return this.raw.slice();
  }

  private assertValidAddress(value: MemoryAddress): void {
    if (value < 0x0000 || value >= this.size) {
      throw new Error(
        `Address ${numberToWordHex(value)} out of range ${numberToWordHex(
          this.size
        )}`
      );
    }
  }

  private assertByte(value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`Out of bounds byte ${numberToHex(value)}`);
    }
  }

  public readByte(address: MemoryAddress): ByteValue {
    this.assertValidAddress(address);
    return this.raw[address];
  }

  protected readBytes(address: MemoryAddress, length: number): Uint8Array {
    this.assertValidAddress(address);
    this.assertValidAddress(address + length - 1);
    return this.raw.slice(address, address + length);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertValidAddress(address);
    this.assertByte(value);
    this.raw[address] = value;
  }
}

export class ZeroPageRam extends Ram {
  public constructor() {
    super(0xff);
  }
}

export class WorkingRam extends Ram {
  public constructor() {
    super(0x2000);
  }
}

export const V_RAM_SIZE = 0x2000;

export type Tile = ReadonlyArray<ReadonlyArray<ColorNumber>>;

type TileTableNumber = 0 | 1;
type BackgroundMapNumber = 0 | 1;

interface BackgroundTile {
  // Bit 0-2  Background Palette number  (BGP0-7)
  readonly bGPNum: number;
  // Bit 3    Tile VRAM Bank number      (0=Bank 0, 1=Bank 1)
  readonly tileTableNumber: TileTableNumber;
  // Bit 5    Horizontal Flip            (0=Normal, 1=Mirror horizontally)
  readonly horizontalFlip: boolean;
  // Bit 6    Vertical Flip              (0=Normal, 1=Mirror vertically)
  readonly verticalFlip: boolean;
  // Bit 7    BG-to-OAM Priority         (0=Use OAM priority bit, 1=BG Priority)
  readonly useBgPriority: boolean;
}

export type BackgroundMap = ReadonlyArray<ReadonlyArray<BackgroundTile>>;

type MemoryRange = Readonly<[MemoryAddress, MemoryAddress]>;

type TileDataIndex = number;

export class VRam extends Ram {
  private static readonly TILE_DATA_TABLE_1_RANGE: MemoryRange = [0x0000, 0x1000];
  private static readonly TILE_DATA_TABLE_2_RANGE: MemoryRange = [0x0800, 0x1800];
  private static readonly TILE_DATA_BYTES: number = 16;
  private static readonly TILE_DATA_DIMENSION: number = 8;
  private static readonly TILE_DATA_INDICES: ReadonlyArray<number> =
    range(0, VRam.TILE_DATA_DIMENSION);
  private static readonly TILE_DATA_BIT_MASKS: ReadonlyArray<number> =
    VRam.TILE_DATA_INDICES.map((i) => 1 << (VRam.TILE_DATA_DIMENSION - i - 1));

  private static readonly BG_MAP_1_RANGE: MemoryRange = [0x1800, 0x1c00];
  private static readonly BG_MAP_2_RANGE: MemoryRange = [0x1c00, 0x2000];
  private static readonly BG_MAP_DIMENSION: number = 32;
  private static readonly BG_MAP_TILE_TABLE_NUMBER_MASK: number = 1 << 3;
  private static readonly BG_MAP_HORIZONTAL_FLIP_MASK: number = 1 << 5;
  private static readonly BG_MAP_VERTICAL_FLIP_MASK: number = 1 << 6;
  private static readonly BG_MAP_PRIORITY_MASK: number = 1 << 7;
  private static readonly BG_MAP_INDICES: ReadonlyArray<number> =
    range(0, VRam.BG_MAP_DIMENSION);

  public constructor() {
    super(V_RAM_SIZE);
  }

  public get bgMap1(): BackgroundMap {
    return this.getBackgroundMap(VRam.BG_MAP_1_RANGE);
  }

  public get bgMap2(): BackgroundMap {
    return this.getBackgroundMap(VRam.BG_MAP_2_RANGE);
  }

  private getBackgroundMap([startAddress,]: MemoryRange): BackgroundMap {
    return VRam.BG_MAP_INDICES.map((y) =>
      VRam.BG_MAP_INDICES.map((x) => {
        const address = startAddress + x + y * VRam.BG_MAP_DIMENSION;
        const byte = this.readByte(address);
        return {
          bGPNum: byte & 0x7,
          tileTableNumber: (byte & VRam.BG_MAP_TILE_TABLE_NUMBER_MASK) !== 0 ? 1 as TileTableNumber : 0,
          horizontalFlip: (byte & VRam.BG_MAP_HORIZONTAL_FLIP_MASK) !== 0,
          verticalFlip: (byte & VRam.BG_MAP_VERTICAL_FLIP_MASK) !== 0,
          useBgPriority: (byte & VRam.BG_MAP_PRIORITY_MASK) !== 0
        }
      })
    );
  }

  public getTileDataFromTable1(index: TileDataIndex): Tile {
    return this.getTileData(VRam.TILE_DATA_TABLE_1_RANGE, index);
  }

  public getTileDataFromTable2(index: TileDataIndex): Tile {
    return this.getTileData(VRam.TILE_DATA_TABLE_2_RANGE, index);
  }

  private getTileData([startAddress, endAddress]: Readonly<[MemoryAddress, MemoryAddress]>, index: TileDataIndex): Tile {
    const address = startAddress + index * VRam.TILE_DATA_BYTES;
    if (address < startAddress || address >= endAddress) {
      throw new Error(`Tile data index ${index} is invalid`);
    }
    return chunk(this.readBytes(address, VRam.TILE_DATA_BYTES), 2)
      .map(([lowerBits, upperBits]) =>
        VRam.TILE_DATA_INDICES.map((i) => {
          const lower = (lowerBits & VRam.TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;
          const upper = (upperBits & VRam.TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;
          if (upper === 1 && lower === 1) {
            return 3;
          }
          if (upper === 1 && lower === 0) {
            return 2;
          }
          if (upper === 0 && lower === 1) {
            return 1;
          }
          return 0;
        })
      );
  }

  public static initializeRandomly(): VRam {
    const vRam = new VRam();
    for (let i = 0; i < V_RAM_SIZE; i++) {
      vRam.writeByte(i, Math.round(Math.random() * 0xff));
    }
    return vRam;
  }
}

export class OamMemory extends Ram {
  public constructor() {
    super(0xa0);
  }
}

// https://fms.komkon.org/GameBoy/Tech/Software.html
export class IOMemory extends Ram {
  public constructor() {
    super(0x7f);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return super.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    // bios seems to use it
    // if (address === 0x0044) {
    //   throw new Error("Current scan line Read-only");
    // }
    super.writeByte(address, value);
  }
}
