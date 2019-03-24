import { ByteValue, MemoryAddress } from "./types";
export declare class Cartridge {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    readByte(address: MemoryAddress): ByteValue;
}
export declare const isValid: (cartridge: Cartridge) => Boolean;
export declare class CartridgeBuilder {
    private readonly _program;
    private constructor();
    program(program: Uint8Array | ReadonlyArray<ByteValue>): CartridgeBuilder;
    build(): Cartridge;
    private clone;
    static builder(): CartridgeBuilder;
}
//# sourceMappingURL=cartridge.d.ts.map