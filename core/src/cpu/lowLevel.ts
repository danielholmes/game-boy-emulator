import { Cpu, Cycles } from './types'
import { Memory, readByte, writeByte } from '../memory'
import { ByteRegister } from './registers'
import { getGroupedRegister, GroupedWordRegister } from './groupedRegisters'

export type LowLevelState = number | undefined

export interface LowLevelOperation
{
  readonly cycles: Cycles;
  readonly execute: (cpu: Cpu, memory: Memory, value: LowLevelState) => LowLevelState;
}

export class LoadRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 0
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, state: LowLevelState): LowLevelState {
    return cpu.registers[this.register]
  }
}

export class ReadMemory implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelState {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    return readByte(memory, value)
  }
}

export class LoadGroupedRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 0
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelState {
    return getGroupedRegister(cpu, this.register)
  }
}

export class WriteMemoryFromGroupedRegisterAddress implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelState {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    const address = getGroupedRegister(cpu, this.register)
    writeByte(memory, address, value)
    return undefined
  }
}

export class StoreInRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelState {
    if (value === undefined) {
      throw new Error('value not defined')
    }
    cpu.registers[this.register] = value
    return undefined
  }
}

export class LoadProgramByte implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelState {
    const byte = readByte(memory, cpu.registers.pc)
    cpu.registers.pc++
    return byte
  }
}
