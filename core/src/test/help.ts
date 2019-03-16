import { CpuRegisters } from '../cpu/registers'
import { Cpu } from '../cpu/types'
import { create as createCpu } from '../cpu'
import { create as createMemory, Memory, writeByte } from '../memory'
import { toPairs } from 'lodash'

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
  const memory = createMemory()
  toPairs(values)
    .forEach(([address, value]) => writeByte(memory, parseInt(address), value))
  return memory
}
