import { Mmu } from "../memory/mmu";
import { CpuRegisters } from "./registers";
export declare type ClockCycles = number;
export declare class Cpu {
    readonly registers: CpuRegisters;
    private remainingCycles;
    constructor();
    tick(mmu: Mmu, cycles: ClockCycles): void;
    tickCycle(mmu: Mmu): void;
}
//# sourceMappingURL=index.d.ts.map