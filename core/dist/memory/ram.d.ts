import { ByteValue, MemoryAddress } from "../types";
declare class Ram {
    protected readonly raw: Uint8Array;
    private readonly size;
    constructor(size: number);
    getValues(): Uint8Array;
    private assertValidAddress;
    private assertByte;
    readByte(address: MemoryAddress): ByteValue;
    writeByte(address: MemoryAddress, value: ByteValue): void;
}
export declare class ZeroPageRam extends Ram {
    constructor();
}
export declare class WorkingRam extends Ram {
    constructor();
}
export declare const V_RAM_SIZE = 8192;
export declare class VRam extends Ram {
    constructor();
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