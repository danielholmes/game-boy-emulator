import { CpuRegisters } from '../cpu/registers'
import { Cpu } from '../cpu/types'
import { create as createCpu } from '../cpu'
import { Memory } from '../memory'
import { toPairs } from 'lodash'

export const EMPTY_MEMORY = new Memory()

export const createCpuWithRegisters = (withRegisters: Partial<CpuRegisters>): Cpu => {
  const cpu = createCpu()
  return {
    ...cpu,
    registers: {
      ...cpu.registers,
      ...withRegisters
    }
  }
}

export const createMemoryWithValues = (values: { [address: number]: number }): Memory => {
  const memory = new Memory()
  toPairs(values)
    .forEach(([address, value]) => memory.writeByte(parseInt(address), value))
  return memory
}
