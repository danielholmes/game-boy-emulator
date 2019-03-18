import { Mmu } from "../memory/mmu";
import { LowLevelOperation } from "./lowLevel";
import { ByteRegister, GroupedWordRegister, Register } from "./registers";
import { MemoryAddress, WordValue } from "../types";
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
    xOr(register: ByteRegister): InstructionDefinition;
    decrementGroupedRegister(register: GroupedWordRegister): InstructionDefinition;
    jrCheck(): InstructionDefinition;
    bitFlags(register: ByteRegister): InstructionDefinition;
    nop(): InstructionDefinition;
    loadRegister(register: ByteRegister): InstructionDefinition;
    loadGroupedRegister(register: GroupedWordRegister): InstructionDefinition;
    writeMemoryFromOperandAddress(): InstructionDefinition;
    writeMemoryFromRegisterAddress(register: Register): InstructionDefinition;
    writeMemoryFromGroupedRegisterAddress(register: GroupedWordRegister): InstructionDefinition;
    loadByteOperand(): InstructionDefinition;
    loadSignedByteOperand(): InstructionDefinition;
    loadWordOperand(): InstructionDefinition;
    loadStackPointer(): InstructionDefinition;
    decrementRegister(register: ByteRegister): InstructionDefinition;
    incrementRegister(register: Register): InstructionDefinition;
    incrementGroupedRegister(register: GroupedWordRegister): InstructionDefinition;
    incrementStackPointer(): InstructionDefinition;
    storeInRegister(register: ByteRegister): InstructionDefinition;
    storeInGroupedRegister(register: GroupedWordRegister): InstructionDefinition;
    storeInStackPointer(): InstructionDefinition;
    readMemory(): InstructionDefinition;
    writeByteFromWordOperandAddress(): InstructionDefinition;
    writeWordFromProgramWord(): InstructionDefinition;
    decrementStackPointer(amount: WordValue): InstructionDefinition;
    setProgramCounter(address: MemoryAddress): InstructionDefinition;
    loadProgramCounter(): InstructionDefinition;
    writeMemoryFromStackPointer(): InstructionDefinition;
    private withOperation;
}
//# sourceMappingURL=instructions.d.ts.map