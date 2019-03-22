import { Mmu } from "../memory/mmu";
import {
  BitFlags,
  DecrementRegister,
  IncrementRegister,
  JrCheck,
  LoadOperand,
  LoadWordOperand,
  LoadRegister,
  LowLevelOperation,
  LowLevelState,
  ReadMemory,
  SetRegister,
  StoreInRegister,
  WriteWordFromGroupedRegisterAddress,
  WriteByteFromOperandAddress,
  XOrRegister,
  WordValueToSignedByte,
  WriteWordFromOperandAddress,
  WriteMemoryFromRegisterAddress,
  WriteMemoryLowByteFromOperandAddress,
  WriteMemoryHighByteFromOperandAddress,
  InternalDelay,
  WriteMemoryWordHighByteFromStackPointer,
  WriteMemoryWordLowByteFromStackPointer,
  RotateLeftThroughCarry,
  ReadMemoryWord, SubtractFromRegister
} from "./lowLevel";
import { ByteRegister, NonAfGroupedWordRegister, Register } from "./registers";
import { sum } from "lodash";
import { MemoryAddress } from "../types";
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

  public jrCheck(): InstructionDefinition {
    return this.withOperation(new JrCheck());
  }

  public bitFlags(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new BitFlags(register));
  }

  public subtractFromRegister(register: Register): InstructionDefinition {
    return this.withOperation(new SubtractFromRegister(register));
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

  public writeMemoryFromRegisterAddress(
    register: Register
  ): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromRegisterAddress(register));
  }

  public writeMemoryFromGroupedRegisterAddress(
    register: NonAfGroupedWordRegister
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

  public decrementRegister(register: Register): InstructionDefinition {
    return this.withOperation(new DecrementRegister(register));
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

  private withOperation(operation: LowLevelOperation): InstructionDefinition {
    return new InstructionDefinition(this.opCode, this.label, [
      ...this.operations,
      operation
    ]);
  }
}
