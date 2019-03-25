import { Mmu } from "../memory/mmu";
import { Cpu } from "../cpu";
import { ReadonlyUint8Array } from "../types";
export declare const createMmu: () => Mmu;
export declare const EMPTY_MEMORY: Mmu;
export interface MmuSnapshot {
    readonly workingRamValues: ReadonlyUint8Array;
}
export declare const createMmuSnapshot: (mmu: Mmu) => MmuSnapshot;
export declare const createCpuSnapshot: (cpu: Cpu) => string;
export declare const wordHighByte: (word: number) => number;
export declare const wordLowByte: (word: number) => number;
export declare const writeWordBigEndian: (mmu: Mmu, address: number, value: number) => void;
//# sourceMappingURL=help.d.ts.map