import { Mmu } from "../memory/mmu";
import { LowLevelOperation, JrFlag } from "./lowLevel";
import { ByteRegister, Register, WordRegister } from "./registers";
import { ByteBitPosition, ByteValue, MemoryAddress, WordValue } from "../types";
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
    jrCheck(flag: JrFlag): InstructionDefinition;
    jr(): InstructionDefinition;
    bitFlags(position: ByteBitPosition): InstructionDefinition;
    compareToRegister(register: Register): InstructionDefinition;
    loadRegister(register: Register): InstructionDefinition;
    loadProgramCounter(): InstructionDefinition;
    writeMemoryFromOperandAddress(): InstructionDefinition;
    writeMemoryFromFf00PlusRegisterAddress(register: ByteRegister): InstructionDefinition;
    writeMemoryFromWordRegisterAddress(register: WordRegister): InstructionDefinition;
    loadByteOperand(): InstructionDefinition;
    addToValue(value: WordValue | ByteValue): InstructionDefinition;
    loadSignedByteOperand(): InstructionDefinition;
    loadWordOperand(): InstructionDefinition;
    decrementByteRegisterWithFlags(register: ByteRegister): InstructionDefinition;
    decrementRegister(register: Register): InstructionDefinition;
    incrementWordRegisterWithFlags(register: WordRegister): InstructionDefinition;
    incrementByteRegisterWithFlags(register: ByteRegister): InstructionDefinition;
    incrementRegister(register: Register): InstructionDefinition;
    storeInRegister(register: Register): InstructionDefinition;
    readMemory(): InstructionDefinition;
    readMemoryWord(): InstructionDefinition;
    writeByteFromWordOperandAddress(): InstructionDefinition;
    writeWordFromProgramWord(): InstructionDefinition;
    setRegister(register: Register, address: MemoryAddress): InstructionDefinition;
    pushWordToStack(): InstructionDefinition;
    writeMemoryWordFromStackPointer(): InstructionDefinition;
    addWithCarryToA(): InstructionDefinition;
    private withOperation;
}
//# sourceMappingURL=instructions.d.ts.map