import { CpuRegisters } from "../cpu/registers";
import { Mmu } from "../memory/mmu";
import { Cpu } from "../cpu";
import { Cartridge } from "../cartridge";
export declare const createMmu: () => Mmu;
export declare const EMPTY_MEMORY: Mmu;
export declare const createCpuWithRegisters: (withRegisters: Partial<CpuRegisters>) => Cpu;
export declare const createCpuRegistersWithRegisters: (withRegisters: Partial<CpuRegisters>) => CpuRegisters;
export declare const createMmuWithValues: (values: {
    [address: number]: number;
}) => Mmu;
export declare const createMmuWithCartridgeAndValues: (cartridge: Cartridge, values?: {
    [address: number]: number;
} | undefined) => Mmu;
export declare const createMemorySnapshot: (mmu: Mmu) => string;
export declare const createCpuSnapshot: (cpu: Cpu) => string;
//# sourceMappingURL=help.d.ts.map