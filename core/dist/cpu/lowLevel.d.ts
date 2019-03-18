import { Mmu } from "../memory/mmu";
import { ByteRegister, GroupedWordRegister, Register } from "./registers";
import { ByteValue, WordValue } from "../types";
import { Cpu, ClockCycles } from ".";
export declare type LowLevelState = ByteValue | WordValue | undefined;
export declare type LowLevelStateReturn = ByteValue | WordValue | void;
export interface LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class LoadRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class ReadMemory implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class LoadGroupedRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: GroupedWordRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class WriteWordFromGroupedRegisterAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: GroupedWordRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class BitFlags implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class JrCheck implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WordValueToSignedByte implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteByteFromOperandAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteWordFromOperandAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class StoreInRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class StoreInGroupedRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: GroupedWordRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class DecrementStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly amount;
    constructor(amount: WordValue);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class LoadProgramCounter implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class WriteMemoryFromOperandAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryFromRegisterAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryFromStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class StoreInStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class SetProgramCounter implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly value;
    constructor(value: WordValue);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class LoadOperand implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn;
}
export declare class LoadWordOperand implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn;
}
export declare class IncrementRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class IncrementGroupedRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: GroupedWordRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class XOrRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class Nop implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(): LowLevelStateReturn;
}
export declare class IncrementStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class LoadStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class DecrementRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class DecrementGroupedRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: GroupedWordRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
//# sourceMappingURL=lowLevel.d.ts.map