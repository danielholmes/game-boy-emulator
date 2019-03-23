import { ByteValue, MemoryAddress, PixelColor } from "../types";
declare class Ram {
    protected readonly raw: Uint8Array;
    private readonly size;
    constructor(size: number);
    getValues(): Uint8Array;
    private assertValidAddress;
    private assertByte;
    readByte(address: MemoryAddress): ByteValue;
    protected readBytes(address: MemoryAddress, length: number): Uint8Array;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare class ZeroPageRam extends Ram {
    constructor();
}
export declare class WorkingRam extends Ram {
    constructor();
}
export declare const V_RAM_SIZE = 8192;
export declare type Tile = ReadonlyArray<ReadonlyArray<PixelColor>>;
export declare class VRam extends Ram {
    private static readonly TILE_DATA_TABLE_1_RANGE;
    private static readonly TILE_DATA_TABLE_2_RANGE;
    private static readonly TILE_DATA_BYTES;
    private static readonly TILE_DATA_DIMENSION;
    private static readonly TILE_DATA_INDICES;
    private static readonly TILE_DATA_BIT_MASKS;
    constructor();
    getTileDataFromTable1(index: number): Tile;
    getTileDataFromTable2(index: number): Tile;
    private getTileData;
    static initializeRandomly(): VRam;
}
export declare class OamMemory extends Ram {
    constructor();
}
export declare class IOMemory extends Ram {
    constructor();
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export {};
//# sourceMappingURL=ram.d.ts.map