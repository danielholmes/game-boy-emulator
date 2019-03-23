import { Mmu } from "../memory/mmu";
import {
  BitFlags,
  DecrementRegister,
  DecrementByteRegisterWithFlags,
  IncrementRegister,
  JrCheck,
  LoadOperand,
  LoadWordOperandHighByte,
  LoadRegister,
  LowLevelOperation,
  LowLevelState,
  ReadMemory,
  SetRegister,
  StoreInRegister,
  WriteByteFromOperandAddress,
  XOrRegister,
  ByteValueToSignedByte,
  WriteWordFromOperandAddress,
  WriteMemoryFromRegisterAddress,
  WriteMemoryLowByteFromOperandAddress,
  WriteMemoryHighByteFromOperandAddress,
  InternalDelay,
  WriteMemoryWordHighByteFromStackPointer,
  WriteMemoryWordLowByteFromStackPointer,
  RotateLeftThroughCarry,
  ReadMemoryWord,
  CompareToRegister,
  JrFlag,
  IncrementByteRegisterWithFlags,
  IncrementWordRegisterWithFlags,
  Jr,
  AddToValue, AddWithCarryToA
} from "./lowLevel";
import { ByteRegister, Register, WordRegister } from "./registers";
import { sum } from "lodash";
import { ByteBitPosition, ByteValue, MemoryAddress, WordValue } from "../types";
import { Cpu, ClockCycles } from "./index";

export type OpCode = number;

export interface Instruction {
  readonly opCode: OpCode;
  readonly label: string;
  execute(cpu: Cpu, mmu: Mmu): ClockCycles;
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

  public execute(cpu: Cpu, mmu: Mmu): ClockCycles {
    this.operations.reduce(
      (value: LowLevelState, op: LowLevelOperation): LowLevelState => {
        const newResult = op.execute(cpu, mmu, value);
        return typeof newResult === "undefined" ? undefined : newResult;
      },
      undefined
    );
    return sum(this.operations.map(op => op.cycles));
  }

  public rotateLeftThroughCarry(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new RotateLeftThroughCarry(register));
  }

  public internalDelay(): InstructionDefinition {
    return this.withOperation(new InternalDelay());
  }

  public xOr(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new XOrRegister(register));
  }

  public jrCheck(flag: JrFlag): InstructionDefinition {
    return this.withOperation(new JrCheck(flag));
  }

  public jr(): InstructionDefinition {
    return this.withOperation(new Jr());
  }

  public bitFlags(position: ByteBitPosition): InstructionDefinition {
    return this.withOperation(new BitFlags(position));
  }

  public compareToRegister(register: Register): InstructionDefinition {
    return this.withOperation(new CompareToRegister(register));
  }

  public loadRegister(register: Register): InstructionDefinition {
    return this.withOperation(new LoadRegister(register));
  }

  public loadProgramCounter(): InstructionDefinition {
    return this.loadRegister("pc");
  }

  public writeMemoryFromOperandAddress(): InstructionDefinition {
    return this.withOperation(new WriteMemoryHighByteFromOperandAddress())
      .withOperation(new WriteMemoryLowByteFromOperandAddress())
      .incrementRegister("pc");
  }

  public writeMemoryFromFf00PlusRegisterAddress(
    register: ByteRegister
  ): InstructionDefinition {
    return this.withOperation(
      new WriteMemoryFromRegisterAddress(register, 0xff00)
    );
  }

  public writeMemoryFromWordRegisterAddress(
    register: WordRegister
  ): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromRegisterAddress(register));
  }

  public loadByteOperand(): InstructionDefinition {
    return this.withOperation(new LoadOperand());
  }

  public addToValue(value: WordValue | ByteValue): InstructionDefinition {
    return this.withOperation(new AddToValue(value));
  }

  public loadSignedByteOperand(): InstructionDefinition {
    return this.loadByteOperand().withOperation(new ByteValueToSignedByte());
  }

  public loadWordOperand(): InstructionDefinition {
    return this.loadByteOperand().withOperation(new LoadWordOperandHighByte());
  }

  public decrementByteRegisterWithFlags(
    register: ByteRegister
  ): InstructionDefinition {
    return this.withOperation(new DecrementByteRegisterWithFlags(register));
  }

  public decrementRegister(register: Register): InstructionDefinition {
    return this.withOperation(new DecrementRegister(register));
  }

  public incrementWordRegisterWithFlags(
    register: WordRegister
  ): InstructionDefinition {
    return this.withOperation(new IncrementWordRegisterWithFlags(register));
  }

  public incrementByteRegisterWithFlags(
    register: ByteRegister
  ): InstructionDefinition {
    return this.withOperation(new IncrementByteRegisterWithFlags(register));
  }

  public incrementRegister(register: Register): InstructionDefinition {
    return this.withOperation(new IncrementRegister(register));
  }

  public storeInRegister(register: Register): InstructionDefinition {
    return this.withOperation(new StoreInRegister(register));
  }

  public readMemory(): InstructionDefinition {
    return this.withOperation(new ReadMemory());
  }

  public readMemoryWord(): InstructionDefinition {
    return this.withOperation(new ReadMemoryWord());
  }

  public writeByteFromWordOperandAddress(): InstructionDefinition {
    return this.withOperation(new WriteByteFromOperandAddress());
  }

  public writeWordFromProgramWord(): InstructionDefinition {
    return this.withOperation(new WriteWordFromOperandAddress());
  }

  public setRegister(
    register: Register,
    address: MemoryAddress
  ): InstructionDefinition {
    return this.withOperation(new SetRegister(register, address));
  }

  public pushWordToStack(): InstructionDefinition {
    return this.decrementRegister("sp")
      .decrementRegister("sp")
      .writeMemoryWordFromStackPointer();
  }

  public writeMemoryWordFromStackPointer(): InstructionDefinition {
    return this.withOperation(
      new WriteMemoryWordHighByteFromStackPointer()
    ).withOperation(new WriteMemoryWordLowByteFromStackPointer());
  }

  public addWithCarryToA(): InstructionDefinition {
    return this.withOperation(new AddWithCarryToA());
  }

  private withOperation(operation: LowLevelOperation): InstructionDefinition {
    return new InstructionDefinition(this.opCode, this.label, [
      ...this.operations,
      operation
    ]);
  }
}
