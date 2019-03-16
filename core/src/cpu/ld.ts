import { Cpu, Cycles } from './types'
import { Memory } from '../memory'
import { ByteRegister } from './registers'
import { sum } from 'lodash'
import {
  LoadGroupedRegister, WriteMemoryFromGroupedRegisterAddress,
  LoadRegister,
  LowLevelOperation,
  LowLevelState,
  ReadMemory,
  StoreInRegister, LoadProgramWord, LoadProgramByte, WriteMemoryFromProgramWordAddress
} from './lowLevel'
import { GroupedWordRegister } from './groupedRegisters'

type OpCode = number

interface Instruction
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
class InstructionDefinition implements Instruction
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
          return newResult ? newResult : undefined
        },
        undefined
      )
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

  public storeInRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new StoreInRegister(register))
  }

  public readMemory(): InstructionDefinition {
    return this.withOperation(new ReadMemory())
  }

  public writeMemoryFromProgramWord(): InstructionDefinition {
    return this.withOperation(new WriteMemoryFromProgramWordAddress())
  }

  private withOperation(operation: LowLevelOperation): InstructionDefinition {
    return new InstructionDefinition(
      this.opCode,
      this.label,
      [...this.operations, operation]
    )
  }
}

export const createLdRR = (opCode: OpCode, register1: ByteRegister, register2: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register1},${register2}`)
    .loadRegister(register2)
    .storeInRegister(register1)

export const createLdRN = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},n`)
    .loadProgramByte()
    .storeInRegister(register)

export const createLdRHlM = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},(hl)`)
    .loadGroupedRegister('hl')
    .readMemory()
    .storeInRegister(register)

export const createLdHlMR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),${register}`)
    .loadRegister(register)
    .writeMemoryFromGroupedRegisterAddress('hl')

export const createLdHlMN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),n`)
    .loadProgramByte()
    .writeMemoryFromGroupedRegisterAddress('hl')

export const createLdGrM = (opCode: OpCode, register: GroupedWordRegister): Instruction =>
  new InstructionDefinition(opCode, `LD a,${register}`)
    .loadGroupedRegister(register)
    .readMemory()
    .storeInRegister('a')

export const createLdAMNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD a,(nn)`)
    .loadProgramWord()
    .readMemory()
    .storeInRegister('a')

export const createLdMRA = (opCode: OpCode, register: GroupedWordRegister): Instruction =>
  new InstructionDefinition(opCode, `LD (r),a`)
    .loadRegister('a')
    .writeMemoryFromGroupedRegisterAddress(register)

export const createLdMNnA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (nn),a`)
    .loadRegister('a')
    .writeMemoryFromProgramWord()
