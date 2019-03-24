import { ByteValue, MemoryAddress } from "./types";
export declare class Cartridge {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    readByte(address: MemoryAddress): ByteValue;
}
export declare const isValid: (cartridge: Cartridge) => Boolean;
//# sourceMappingURL=cartridge.d.ts.map