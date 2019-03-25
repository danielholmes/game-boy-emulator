import { ByteValue, MemoryAddress, ReadonlyUint8Array, ColorNumber } from "../types";
export declare class ZeroPageRam {
    private readonly storage;
    constructor();
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare const WORKING_RAM_SIZE = 8192;
export declare class WorkingRam {
    private readonly storage;
    constructor();
    readonly values: ReadonlyUint8Array;
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare const V_RAM_SIZE = 8192;
export declare type Tile = ReadonlyArray<ReadonlyArray<ColorNumber>>;
export declare type TileDataIndex = number;
export declare type BackgroundMap = ReadonlyArray<ReadonlyUint8Array>;
export declare class VRam {
    private static readonly TILE_DATA_TABLE_1_RANGE;
    private static readonly TILE_DATA_TABLE_2_RANGE;
    private static readonly TILE_DATA_BYTES;
    private static readonly TILE_DATA_DIMENSION;
    private static readonly TILE_DATA_INDICES;
    private static readonly TILE_DATA_BIT_MASKS;
    private static readonly BG_MAP_1_RANGE;
    private static readonly BG_MAP_2_RANGE;
    private static readonly BG_MAP_DIMENSION;
    private static readonly BG_MAP_INDICES;
    private readonly storage;
    constructor();
    readonly values: ReadonlyUint8Array;
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
    readonly bgMap1: BackgroundMap;
    readonly bgMap2: BackgroundMap;
    private getBackgroundMap;
    getTileDataFromTable1(index: TileDataIndex): Tile;
    getTileDataFromTable2(index: TileDataIndex): Tile;
    private getTileData;
    static initializeRandomly(): VRam;
}
export declare class OamMemory {
    private readonly storage;
    constructor();
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare class IOMemory {
    private readonly storage;
    constructor();
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
//# sourceMappingURL=ram.d.ts.map