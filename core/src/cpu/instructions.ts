import { Cpu, Cycles } from "./types";
import { Mmu } from "../memory/mmu";
import {
  BitFlags,
  DecrementGroupedRegister,
  DecrementRegister,
  DecrementStackPointer,
  IncrementGroupedRegister,
  IncrementStackPointer,
  JrCheck,
  LoadGroupedRegister,
  LoadOperand,
  LoadProgramCounter,
  LoadWordOperand,
  LoadRegister,
  LoadStackPointer,
  LowLevelOperation,
  LowLevelState,
  Nop,
  ReadMemory,
  SetProgramCounter,
  StoreInGroupedRegister,
  StoreInRegister,
  StoreInStackPointer,
  WriteWordFromGroupedRegisterAddress,
  WriteByteFromOperandAddress,
  WriteMemoryFromStackPointer,
  XOrRegister,
  WordValueToSignedByte,
  WriteWordFromOperandAddress
} from "./lowLevel";
import { ByteRegister, GroupedWordRegister } from "./registers";
import { sum } from "lodash";
import { MemoryAddress, WordValue } from "../types";

export type OpCode = number;

export interface Instruction {
  readonly opCode: OpCode;
  readonly label: string;
  execute(cpu: Cpu, mmu: Mmu): Cycles;
}

// TODO: Definition to generate label?

// TODO: A chained instruction definition that only allows valid
// e.g. not allow loadFromRegister.loadFromRegister
// if even relevant, see how other instructions pan out
export class InstructionDefinition implements Instruction {
  public readonly opCode: OpCode;
  public readonly label: string;
  private readonly operations: ReadonlyArray<LowLevelOperation>;

  public constructor(
    opCode: OpCode,
    label: string,
    operations: ReadonlyArray<LowLevelOperation> = []
  ) {
    this.opCode = opCode;
    this.label = label;
    this.operations = operations;
  }

  public execute(cpu: Cpu, mmu: Mmu): Cycles {
    this.operations.reduce(
      (value: LowLevelState, op: LowLevelOperation): LowLevelState => {
        const newResult = op.execute(cpu, mmu, value);
        return typeof newResult === "undefined" ? undefined : newResult;
      },
      undefined
    );
    return sum(this.operations.map(op => op.cycles)) + 4;
    // 4 are the cycles from reading the instruction. Perhaps shouldn't actually go here
  }

  public xOr(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new XOrRegister(register));
  }

  public decrementGroupedRegister(
    register: GroupedWordRegister
  ): InstructionDefinition {
    return this.withOperation(new DecrementGroupedRegister(register));
  }

  public jrCheck(): InstructionDefinition {
    return this.withOperation(new JrCheck());
  }

  public bitFlags(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new BitFlags(register));
  }

  public nop(): InstructionDefinition {
    return this.withOperation(new Nop());
  }

  public loadRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new LoadRegister(register));
  }

  public loadGroupedRegister(
    register: GroupedWordRegister
  ): InstructionDefinition {
    return this.withOperation(new LoadGroupedRegister(register));
  }

  public writeMemoryFromGroupedRegisterAddress(
    register: GroupedWordRegister
  ): InstructionDefinition {
    return this.withOperation(
      new WriteWordFromGroupedRegisterAddress(register)
    );
  }

  public loadByteOperand(): InstructionDefinition {
    return this.withOperation(new LoadOperand());
  }

  public loadSignedByteOperand(): InstructionDefinition {
    return this.loadByteOperand().withOperation(new WordValueToSignedByte());
  }

  public loadWordOperand(): InstructionDefinition {
    return this.withOperation(new LoadWordOperand());
  }

  public loadStackPointer(): InstructionDefinition {
    return this.withOperation(new LoadStackPointer());
  }

  public decrementRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new DecrementRegister(register));
  }

  public incrementGroupedRegister(
    register: GroupedWordRegister
  ): InstructionDefinition {
    return this.withOperation(new IncrementGroupedRegister(register));
  }

  public incrementStackPointer(): InstructionDefinition {
    return this.withOperation(new IncrementStackPointer());
  }

  public storeInRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new StoreInRegister(register));
  }

  public storeInGroupedRegister(
    register: GroupedWordRegister
  ): InstructionDefinition {
    return this.withOperation(new StoreInGroupedRegister(register));
  }

  public storeInStackPointer(): InstructionDefinition {
    return this.withOperation(new StoreInStackPointer());
  }

  public readMemory(): InstructionDefinition {
    return this.withOperation(new ReadMemory());
  }

  public writeByteFromWordOperandAddress(): InstructionDefinition {
    return this.withOperation(new WriteByteFromOperandAddress());
  }

  public writeWordFromProgramWord(): InstructionDefinition {
    return this.withOperation(new WriteWordFromOperandAddress());
  }

  public decrementStackPointer(amount: WordValue): InstructionDefinition {
    return this.withOperation(new DecrementStackPointer(amount));
  }

  public setProgramCounter(address: MemoryAddress): InstructionDefinition {
    return this.withOperation(new SetProgramCounter(address));
  }

  public loadProgramCounter(): InstructionDefinition {
    return this.withOperation(new LoadProgramCounter());
  }

  public writeMemoryFromStackPointer(): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromStackPointer());
  }

  private withOperation(operation: LowLevelOperation): InstructionDefinition {
    return new InstructionDefinition(this.opCode, this.label, [
      ...this.operations,
      operation
    ]);
  }
}
