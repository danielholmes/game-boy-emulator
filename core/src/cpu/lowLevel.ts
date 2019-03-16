import { Cpu, Cycles } from './types'
import { Memory, readByte, readWord, writeByte } from '../memory'
import { ByteRegister } from './registers'
import { getGroupedRegister, GroupedWordRegister } from './groupedRegisters'
import { ByteValue, WordValue } from '../types'

export type LowLevelState = ByteValue | WordValue | undefined
export type LowLevelStateReturn = ByteValue | WordValue | void

export interface LowLevelOperation
{
  readonly cycles: Cycles;
  readonly execute: (cpu: Cpu, memory: Memory, value: LowLevelState) => LowLevelStateReturn;
}

export class LoadRegister implements LowLevelOperation
{
  public readonly cycles: Cycles = 0
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, state: LowLevelState): LowLevelStateReturn {
    return cpu.registers[this.register]
  }
}

export class ReadMemory implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
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

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    return getGroupedRegister(cpu, this.register)
  }
}

export class WriteMemoryFromGroupedRegisterAddress implements LowLevelOperation
{
  public readonly cycles: Cycles = 8
  private readonly register: GroupedWordRegister

  public constructor(register: GroupedWordRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    const address = getGroupedRegister(cpu, this.register)
    writeByte(memory, address, value)
  }
}

export class WriteMemoryFromProgramWordAddress implements LowLevelOperation
{
  public readonly cycles: Cycles = 16

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value undefined')
    }
    const address = cpu.registers.pc
    writeByte(memory, address, value)
    cpu.registers.pc += 2
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

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error('value not defined')
    }
    cpu.registers[this.register] = value
  }
}

export class LoadProgramByte implements LowLevelOperation
{
  public readonly cycles: Cycles = 4

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const byte = readByte(memory, cpu.registers.pc)
    cpu.registers.pc++
    return byte
  }
}

export class LoadProgramWord implements LowLevelOperation
{
  public readonly cycles: Cycles = 8

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const byte = readWord(memory, cpu.registers.pc)
    cpu.registers.pc += 2
    return byte
  }
}
