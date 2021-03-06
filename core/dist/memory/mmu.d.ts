import { ByteValue, MemoryAddress, ReadonlyUint8Array } from "../types";
import { WorkingRam, VRam, ZeroPageRam, IOMemory, OamMemory, ReadonlyVRam } from "./ram";
import { Bios } from "../bios";
import { Cartridge } from "../cartridge";
export declare const WORKING_RAM_RANGE: Readonly<{
    start: MemoryAddress;
    end: MemoryAddress;
}>;
export declare class Mmu {
    private readonly bios;
    private readonly workingRam;
    private readonly _vRam;
    private readonly io;
    private readonly oam;
    private readonly zeroPage;
    private cartridge?;
    constructor(bios: Bios, ram: WorkingRam, vRam: VRam, io: IOMemory, oam: OamMemory, zeroPage: ZeroPageRam, cartridge?: Cartridge);
    readonly vRam: ReadonlyVRam;
    readonly isInBios: boolean;
    readonly bgP: ByteValue;
    readonly obP0: ByteValue;
    readonly obP1: ByteValue;
    readonly scY: ByteValue;
    readonly scX: ByteValue;
    readonly workingRamValues: ReadonlyUint8Array;
    loadCartridge(cartridge: Cartridge): void;
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare type ReadonlyMmu = Pick<Mmu, "readByte" | "scX" | "scY" | "bgP" | "obP0" | "obP1" | "isInBios">;
//# sourceMappingURL=mmu.d.ts.map