/* eslint-disable */
import {
  ByteValue,
  MemoryAddress,
  ReadonlyUint8Array,
  ColorNumber
} from "../types";
import { range, chunk } from "lodash";
import { toWordHexString } from "..";
import { toHexString } from "../utils/numberUtils";

class ByteRamStorage {
  protected readonly raw: ReadonlyUint8Array;
  private readonly size: number;

  public constructor(size: number) {
    this.size = size;
    this.raw = new Uint8Array(this.size);
  }

  public get values(): ReadonlyUint8Array {
    return this.raw;
  }

  private assertValidAddress(value: MemoryAddress): void {
    if (value < 0x0000 || value >= this.size) {
      throw new Error(
        `Address ${toWordHexString(value)} out of range ${toWordHexString(
          this.size
        )}`
      );
    }
  }

  public readBytes(address: MemoryAddress, length: number): ReadonlyUint8Array {
    this.assertValidAddress(address);
    this.assertValidAddress(address + length - 1);
    return this.raw.subarray(address, address + length);
  }

  private assertByte(value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`Out of bounds byte ${toHexString(value)}`);
    }
  }

  public readByte(address: MemoryAddress): ByteValue {
    this.assertValidAddress(address);
    return this.raw[address];
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertValidAddress(address);
    this.assertByte(value);
    this.raw[address] = value;
  }
}

export class ZeroPageRam {
  private readonly storage: ByteRamStorage;

  public constructor() {
    this.storage = new ByteRamStorage(0xff);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.storage.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.storage.writeByte(address, value);
  }
}

export const WORKING_RAM_SIZE = 0x2000;

export class WorkingRam {
  private readonly storage: ByteRamStorage;

  public constructor() {
    this.storage = new ByteRamStorage(WORKING_RAM_SIZE);
  }

  public get values(): ReadonlyUint8Array {
    return this.storage.values;
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.storage.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.storage.writeByte(address, value);
  }
}

export const V_RAM_SIZE = 0x2000;

export type Tile = ReadonlyArray<ReadonlyArray<ColorNumber>>;

type TileTableNumber = 0 | 1;

type MemoryRange = Readonly<[MemoryAddress, MemoryAddress]>;

export type TileDataIndex = number;

export type BackgroundMap = ReadonlyArray<ReadonlyUint8Array>;

export class VRam {
  private static readonly TILE_DATA_TABLE_1_RANGE: MemoryRange = [0x0000, 0x1000];
  private static readonly TILE_DATA_TABLE_2_RANGE: MemoryRange = [0x0800, 0x1800];
  private static readonly TILE_DATA_BYTES: number = 16;
  private static readonly TILE_DATA_DIMENSION: number = 8;
  private static readonly TILE_DATA_INDICES: ReadonlyArray<number> =
    range(0, VRam.TILE_DATA_DIMENSION);
  private static readonly TILE_DATA_BIT_MASKS: ReadonlyUint8Array =
    new Uint8Array(
      VRam.TILE_DATA_INDICES
        .map((i) => 1 << (VRam.TILE_DATA_DIMENSION - i - 1))
    );

  private static readonly BG_MAP_1_RANGE: MemoryRange = [0x1800, 0x1c00];
  private static readonly BG_MAP_2_RANGE: MemoryRange = [0x1c00, 0x2000];
  private static readonly BG_MAP_DIMENSION: number = 32;
  private static readonly BG_MAP_INDICES: ReadonlyArray<number> =
    range(0, VRam.BG_MAP_DIMENSION);

  private readonly storage: ByteRamStorage;

  public constructor() {
    this.storage = new ByteRamStorage(V_RAM_SIZE);
  }

  public get values(): ReadonlyUint8Array {
    return this.storage.values;
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.storage.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.storage.writeByte(address, value);
  }

  public get bgMap1(): BackgroundMap {
    return this.getBackgroundMap(VRam.BG_MAP_1_RANGE);
  }

  public get bgMap2(): BackgroundMap {
    return this.getBackgroundMap(VRam.BG_MAP_2_RANGE);
  }

  private getBackgroundMap([startAddress,]: MemoryRange): BackgroundMap {
    return VRam.BG_MAP_INDICES.map((y) =>
      new Uint8Array(
        VRam.BG_MAP_INDICES.map((x) => {
          const address = startAddress + x + y * VRam.BG_MAP_DIMENSION;
          return this.readByte(address);
        })
      )
    );
  }

  public getTileDataFromTable1(index: TileDataIndex): Tile {
    return this.getTileData(VRam.TILE_DATA_TABLE_1_RANGE, index);
  }

  public getTileDataFromTable2(index: TileDataIndex): Tile {
    return this.getTileData(VRam.TILE_DATA_TABLE_2_RANGE, index);
  }

  private getTileData(
    [startAddress, endAddress]: Readonly<[MemoryAddress, MemoryAddress]>,
    index: TileDataIndex
  ): Tile {
    const address = startAddress + index * VRam.TILE_DATA_BYTES;
    if (address < startAddress || address >= endAddress) {
      throw new Error(`Tile data index ${index} is invalid`);
    }
    return chunk(this.storage.readBytes(address, VRam.TILE_DATA_BYTES), 2)
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

export class OamMemory {
  private readonly storage: ByteRamStorage;

  public constructor() {
    this.storage = new ByteRamStorage(0xa0);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.storage.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.storage.writeByte(address, value);
  }
}

// https://fms.komkon.org/GameBoy/Tech/Software.html
export class IOMemory {
  private readonly storage: ByteRamStorage;

  public constructor() {
    this.storage = new ByteRamStorage(0x7f);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.storage.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.storage.writeByte(address, value);
  }
}
