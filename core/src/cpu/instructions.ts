import { Cpu, Cycles } from './types'
import { Memory, MemoryAddress } from '../memory'
import {
  BitFlags,
  DecrementGroupedRegister,
  DecrementRegister,
  DecrementStackPointer, IncrementGroupedRegister, IncrementProgramCounterFlagCheck, IncrementStackPointer, JrCheck,
  LoadGroupedRegister, LoadProgramByte, LoadProgramCounter, LoadProgramWord,
  LoadRegister, LoadStackPointer,
  LowLevelOperation,
  LowLevelState, Nop, ReadMemory, SetProgramCounter, StoreInGroupedRegister, StoreInRegister, StoreInStackPointer,
  WriteMemoryFromGroupedRegisterAddress, WriteMemoryFromProgramWordAddress, WriteMemoryFromStackPointer, XOrRegister
} from './lowLevel'
import { ByteRegister } from './registers'
import { GroupedWordRegister } from './groupedRegisters'
import { sum } from 'lodash'
import { ByteValue, WordValue } from '../types'

export type OpCode = number

export interface Instruction
{
  readonly opCode: OpCode;
  readonly label: string;
  readonly cycles: Cycles;
  readonly execute: (cpu: Cpu, memory: Memory) => void;
}

// TODO: Definition to generate label?

// TODO: A chained instruction definition that only allows valid
// e.g. not allow loadFromRegister.loadFromRegister
// if even relevant, see how other instructions pan out
export class InstructionDefinition implements Instruction
{
  public readonly opCode: OpCode
  public readonly label: string
  public readonly cycles: Cycles
  private readonly operations: ReadonlyArray<LowLevelOperation>

  public constructor(opCode: OpCode, label: string, operations: ReadonlyArray<LowLevelOperation> = [])
  {
    this.opCode = opCode
    this.label = label
    this.operations = operations
    this.cycles = sum(operations.map((op) => op.cycles))
  }

  public execute(cpu: Cpu, memory: Memory): void {
    this.operations
      .reduce(
        (value: LowLevelState, op: LowLevelOperation): LowLevelState => {
          const newResult = op.execute(cpu, memory, value)
          return typeof newResult === 'undefined' ? undefined : newResult
        },
        undefined
      )
  }

  public xOr(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new XOrRegister(register))
  }

  public decrementGroupedRegister(register: GroupedWordRegister): InstructionDefinition {
    return this.withOperation(new DecrementGroupedRegister(register))
  }

  public jrCheck(): InstructionDefinition {
    return this.withOperation(new JrCheck())
  }

  public incrementProgramCounterFlagCheck(mask: ByteValue, comparison: ByteValue): InstructionDefinition {
    return this.withOperation(new IncrementProgramCounterFlagCheck(mask, comparison))
  }

  public bitFlags(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new BitFlags(register))
  }

  public nop(): InstructionDefinition {
    return this.withOperation(new Nop())
  }

  public loadRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new LoadRegister(register))
  }

  public loadGroupedRegister(register: GroupedWordRegister): InstructionDefinition {
    return this.withOperation(new LoadGroupedRegister(register))
  }

  public writeMemoryFromGroupedRegisterAddress(register: GroupedWordRegister): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromGroupedRegisterAddress(register))
  }

  public loadProgramByte(): InstructionDefinition {
    return this.withOperation(new LoadProgramByte())
  }

  public loadProgramWord(): InstructionDefinition {
    return this.withOperation(new LoadProgramWord())
  }

  public loadStackPointer(): InstructionDefinition {
    return this.withOperation(new LoadStackPointer())
  }

  public decrementRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new DecrementRegister(register))
  }

  public incrementGroupedRegister(register: GroupedWordRegister): InstructionDefinition {
    return this.withOperation(new IncrementGroupedRegister(register))
  }

  public incrementStackPointer(): InstructionDefinition {
    return this.withOperation(new IncrementStackPointer())
  }

  public storeInRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new StoreInRegister(register))
  }

  public storeInGroupedRegister(register: GroupedWordRegister): InstructionDefinition {
    return this.withOperation(new StoreInGroupedRegister(register))
  }

  public storeInStackPointer(): InstructionDefinition {
    return this.withOperation(new StoreInStackPointer())
  }

  public readMemory(): InstructionDefinition {
    return this.withOperation(new ReadMemory())
  }

  public writeMemoryFromProgramWord(): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromProgramWordAddress())
  }

  public decrementStackPointer(amount: WordValue): InstructionDefinition {
    return this.withOperation(new DecrementStackPointer(amount))
  }

  public setProgramCounter(address: MemoryAddress): InstructionDefinition {
    return this.withOperation(new SetProgramCounter(address))
  }

  public loadProgramCounter(): InstructionDefinition {
    return this.withOperation(new LoadProgramCounter())
  }

  public writeMemoryFromStackPointer(): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromStackPointer())
  }

  private withOperation(operation: LowLevelOperation): InstructionDefinition {
    return new InstructionDefinition(
      this.opCode,
      this.label,
      [...this.operations, operation]
    )
  }
}
