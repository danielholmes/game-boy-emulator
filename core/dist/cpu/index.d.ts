import { Mmu } from "../memory/mmu";
import { OpCode } from "./instructions";
import { CpuRegisters } from "./registers";
import { WordValue } from "../types";
export declare type ClockCycles = number;
export declare class Cpu {
    readonly registers: CpuRegisters;
    private remainingCycles;
    private _currentInstructionPc?;
    constructor();
    readonly currentInstructionPc: WordValue;
    getInstructionLabel(opCode: OpCode): string;
    tick(mmu: Mmu, cycles: ClockCycles): void;
    tickCycle(mmu: Mmu): void;
}
//# sourceMappingURL=index.d.ts.map