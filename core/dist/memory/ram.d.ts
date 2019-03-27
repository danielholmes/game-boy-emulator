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
export declare type TileMap = ReadonlyArray<Tile>;
export declare class VRam {
    private readonly storage;
    constructor();
    readonly values: ReadonlyUint8Array;
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
    readonly bgMap1: BackgroundMap;
    readonly bgMap2: BackgroundMap;
    private getBackgroundMap;
    readonly tileMap1: TileMap;
    readonly tileMap2: TileMap;
    getTileDataFromTable1(index: TileDataIndex): Tile;
    getTileDataFromTable2(index: TileDataIndex): Tile;
    private getTileMap;
    private getTileData;
    static initializeRandomly(): VRam;
}
export declare type ReadonlyVRam = Pick<VRam, 'getTileDataFromTable1' | 'getTileDataFromTable2' | 'bgMap1' | 'bgMap2' | 'values' | 'tileMap1' | 'tileMap2' | 'readByte'>;
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