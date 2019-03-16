import { Cpu, Cycles } from './types'
import { Memory } from '../memory'
import { ByteRegister } from './registers'
import { sum } from 'lodash'
import {
  LoadGroupedRegister, WriteMemoryFromGroupedRegisterAddress,
  LoadProgramByte,
  LoadRegister,
  LowLevelOperation,
  LowLevelState,
  ReadMemory,
  StoreInRegister
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
    let result: LowLevelState = undefined
    this.operations.forEach((op) => {
      result = op.execute(cpu, memory, result)
    })
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

  public storeInRegister(register: ByteRegister): InstructionDefinition {
    return this.withOperation(new StoreInRegister(register))
  }

  public readMemory(): InstructionDefinition {
    return this.withOperation(new ReadMemory())
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

export const createLdRHl = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},HL`)
    .loadGroupedRegister('hl')
    .readMemory()
    .storeInRegister(register)

export const createLdHlR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD HL,${register}`)
    .loadRegister(register)
    .writeMemoryFromGroupedRegisterAddress('hl')
