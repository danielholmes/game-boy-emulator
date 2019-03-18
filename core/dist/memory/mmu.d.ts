import { ByteValue, MemoryAddress, WordValue } from "../types";
import { WorkingRam, VRam, ZeroPageRam, IOMemory, OamMemory } from "./ram";
import { Bios } from "../bios";
import { Cartridge } from "../cartridge";
export declare class Mmu {
    private readonly bios;
    private readonly workingRam;
    private readonly vRam;
    private readonly io;
    private readonly oam;
    private readonly zeroPage;
    private cartridge?;
    constructor(bios: Bios, ram: WorkingRam, vRam: VRam, io: IOMemory, oam: OamMemory, zeroPage: ZeroPageRam, cartridge?: Cartridge);
    loadCartridge(cartridge: Cartridge): void;
    readByte(address: MemoryAddress): ByteValue;
    readBigEndianWord(address: MemoryAddress): WordValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
    writeWordBigEndian(address: MemoryAddress, value: WordValue): void;
}
//# sourceMappingURL=mmu.d.ts.map