import { CpuRegisters, Register } from '../cpu/registers'
import { Cpu } from '../cpu/types'
import { create as createCpu } from '../cpu'
import { Memory } from '../memory'
import { toPairs } from 'lodash'
import { ByteValue } from '../types'

export const EMPTY_MEMORY = new Memory()

// Dummy to get around typing
const isRegister = (name: string): name is Register => true

export const createCpuWithRegisters = (withRegisters: Partial<CpuRegisters>): Cpu => {
  const cpu = createCpu()
  toPairs(withRegisters)
    .forEach(([register, value]) => {
      if (isRegister(register) && typeof value !== 'undefined') {
        cpu.registers[register] = value
      }
    })
  return cpu
}

export const createMemoryWithValues = (values: { [address: number]: ByteValue }): Memory => {
  const memory = new Memory()
  toPairs(values)
    .forEach(([address, value]) => memory.writeByte(parseInt(address), value))
  return memory
}
