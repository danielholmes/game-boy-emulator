import { ByteValue, MemoryAddress } from "./types";
export declare const CARTRIDGE_PROGRAM_START: number;
export declare class Cartridge {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    readByte(address: MemoryAddress): ByteValue;
    static builder(): CartridgeBuilder;
    static buildWithProgram(program: Uint8Array | ReadonlyArray<ByteValue>): Cartridge;
}
declare class CartridgeBuilder {
    private readonly _program;
    constructor(program?: Uint8Array);
    program(program: Uint8Array | ReadonlyArray<ByteValue>): CartridgeBuilder;
    build(): Cartridge;
    private clone;
}
export declare const isValid: (cartridge: Cartridge) => boolean;
export {};
//# sourceMappingURL=cartridge.d.ts.map