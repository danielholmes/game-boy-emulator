import { ByteValue, MemoryAddress } from "./types";
export declare class Cartridge {
    static readonly PC_START: MemoryAddress;
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    readByte(address: MemoryAddress): ByteValue;
    static newWithNintendoLogo(bytes: Uint8Array): Cartridge;
}
//# sourceMappingURL=cartridge.d.ts.map