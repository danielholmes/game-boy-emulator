import { ByteValue, MemoryAddress, ReadonlyUint8Array } from "./types";
export declare const CARTRIDGE_PROGRAM_START: number;
export declare class Cartridge {
    readonly bytes: ReadonlyUint8Array;
    constructor(bytes: ReadonlyUint8Array);
    readByte(address: MemoryAddress): ByteValue;
    static builder(): CartridgeBuilder;
    static buildWithProgram(program: ReadonlyUint8Array | ReadonlyArray<ByteValue>): Cartridge;
}
declare class CartridgeBuilder {
    private readonly _program;
    constructor(program?: ReadonlyUint8Array);
    program(program: ReadonlyUint8Array | ReadonlyArray<ByteValue>): CartridgeBuilder;
    build(): Cartridge;
    private clone;
}
export declare const isValid: (cartridge: Cartridge) => boolean;
export {};
//# sourceMappingURL=cartridge.d.ts.map