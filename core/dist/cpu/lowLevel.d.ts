import { Mmu } from "../memory/mmu";
import { ByteRegister, Register, WordRegister } from "./registers";
import { ByteValue, WordValue, ByteBitPosition } from "../types";
import { Cpu, ClockCycles } from ".";
export declare type LowLevelState = ByteValue | WordValue | undefined;
export declare type LowLevelStateReturn = ByteValue | WordValue | void;
export interface LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class LoadRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class CompareToRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class RotateLeftThroughCarry implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class ReadMemoryWord implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class ReadMemory implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class BitFlags implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly position;
    constructor(position: ByteBitPosition);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare type CheckFlag = "fNz" | "fZ" | "fC" | "fNc";
export declare const CHECK_FLAGS: ReadonlyArray<CheckFlag>;
export declare class SetToPcIfFlag implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly flag;
    constructor(flag: CheckFlag);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class AddToPcIfFlag implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly flag;
    constructor(flag: CheckFlag);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class ByteValueToSignedByte implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteByteFromOperandAddress implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteWordFromOperandAddress implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class AddToRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class StoreInRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryHighByteFromOperandAddress implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryLowByteFromOperandAddress implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryFromRegisterAddress implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    private readonly add;
    constructor(register: Register, add?: WordValue);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class InternalDelay implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryWordHighByteFromStackPointer implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class WriteMemoryWordLowByteFromStackPointer implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class SetRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    private readonly value;
    constructor(register: Register, value: WordValue);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class AddWithCarryToA implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class AddToValue implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly amount;
    constructor(amount: WordValue | ByteValue);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class LoadOperand implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn;
}
export declare class LoadWordOperandHighByte implements LowLevelOp {
    readonly cycles: ClockCycles;
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class IncrementWordRegisterWithFlags implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: WordRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class IncrementByteRegisterWithFlags implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class IncrementRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class XOrRegister implements LowLevelOp {
    private static readonly F_Z_SET;
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu): LowLevelStateReturn;
}
export declare class DecrementByteRegisterWithFlags implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: ByteRegister);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
export declare class DecrementRegister implements LowLevelOp {
    readonly cycles: ClockCycles;
    private readonly register;
    constructor(register: Register);
    execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}
//# sourceMappingURL=lowLevel.d.ts.map