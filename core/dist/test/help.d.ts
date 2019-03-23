import { Mmu } from "../memory/mmu";
import { Cpu } from "../cpu";
import { Cartridge } from "../cartridge";
export declare const createMmu: () => Mmu;
export declare const EMPTY_MEMORY: Mmu;
export declare const createMmuWithValues: (values: {
    [address: number]: number;
}) => Mmu;
export declare const createMmuWithCartridgeAndValues: (cartridge: Cartridge, values?: {
    [address: number]: number;
} | undefined) => Mmu;
export interface MmuSnapshot {
    readonly workingRamValues: Uint8Array;
}
export declare const createMmuSnapshot: (mmu: Mmu) => MmuSnapshot;
export declare const createCpuSnapshot: (cpu: Cpu) => string;
//# sourceMappingURL=help.d.ts.map