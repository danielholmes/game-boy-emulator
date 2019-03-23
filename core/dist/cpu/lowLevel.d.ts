import { Mmu } from "../memory/mmu";
import { ByteRegister, NonAfGroupedWordRegister, Register } from "./registers";
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
    constructor(register: Register);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class CompareToRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class RotateLeftThroughCarry implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class ReadMemoryWord implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class ReadMemory implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteWordFromGroupedRegisterAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: NonAfGroupedWordRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class BitFlags implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare type JrFlag = 'fNz' | 'fZ' | 'fC' | 'fNc';
export declare const JR_FLAGS: ReadonlyArray<JrFlag>;
export declare class JrCheck implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly flag;
    constructor(flag: JrFlag);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class ByteValueToSignedByte implements LowLevelOperation {
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
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryHighByteFromOperandAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryLowByteFromOperandAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryFromRegisterAddress implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class InternalDelay implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryWordHighByteFromStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryWordLowByteFromStackPointer implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class SetRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    private readonly value;
    constructor(register: Register, value: WordValue);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class LoadOperand implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn;
}
export declare class LoadWordOperandHighByte implements LowLevelOperation {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class IncrementRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class XOrRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class DecrementRegister implements LowLevelOperation {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
//# sourceMappingURL=lowLevel.d.ts.map