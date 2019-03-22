import { Mmu } from "../memory/mmu";
import { LowLevelOperation } from "./lowLevel";
import { ByteRegister, NonAfGroupedWordRegister, Register } from "./registers";
import { MemoryAddress } from "../types";
import { Cpu, ClockCycles } from "./index";
export declare type OpCode = number;
export interface Instruction {
    readonly opCode: OpCode;
    readonly label: string;
    execute(cpu: Cpu, mmu: Mmu): ClockCycles;
}
export declare class InstructionDefinition implements Instruction {
    readonly opCode: OpCode;
    readonly label: string;
    private readonly operations;
    constructor(opCode: OpCode, label: string, operations?: ReadonlyArray<LowLevelOperation>);
    execute(cpu: Cpu, mmu: Mmu): ClockCycles;
    rotateLeftThroughCarry(register: ByteRegister): InstructionDefinition;
    internalDelay(): InstructionDefinition;
    xOr(register: ByteRegister): InstructionDefinition;
    jrCheck(): InstructionDefinition;
    bitFlags(register: ByteRegister): InstructionDefinition;
    compareToRegister(register: Register): InstructionDefinition;
    loadRegister(register: Register): InstructionDefinition;
    loadProgramCounter(): InstructionDefinition;
    writeMemoryFromOperandAddress(): InstructionDefinition;
    writeMemoryFromRegisterAddress(register: Register): InstructionDefinition;
    writeMemoryFromGroupedRegisterAddress(register: NonAfGroupedWordRegister): InstructionDefinition;
    loadByteOperand(): InstructionDefinition;
    loadSignedByteOperand(): InstructionDefinition;
    loadWordOperand(): InstructionDefinition;
    decrementRegister(register: Register): InstructionDefinition;
    incrementRegister(register: Register): InstructionDefinition;
    storeInRegister(register: Register): InstructionDefinition;
    readMemory(): InstructionDefinition;
    readMemoryWord(): InstructionDefinition;
    writeByteFromWordOperandAddress(): InstructionDefinition;
    writeWordFromProgramWord(): InstructionDefinition;
    setRegister(register: Register, address: MemoryAddress): InstructionDefinition;
    pushWordToStack(): InstructionDefinition;
    writeMemoryWordFromStackPointer(): InstructionDefinition;
    private withOperation;
}
//# sourceMappingURL=instructions.d.ts.map