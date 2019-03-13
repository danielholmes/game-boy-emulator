/* global describe, test, expect */

import { Memory, create as createMemory } from '../../memory'
import { CpuRegisters } from '../registers'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { setGroupedRegister } from '../groupedRegisters'

const createCpuWithRegisters = (withRegisters: Partial<CpuRegisters>): Cpu => {
  const cpu = createCpu()
  return {
    ...cpu,
    registers: {
      ...cpu.registers,
      ...withRegisters
    }
  }
}

describe('cpu', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = createMemory()
  })

  describe('setGroupedRegister', () => {
    test('set hl', () => {
      setGroupedRegister(cpu, 'hl', 0xfe12)

      expect(cpu).toEqual(createCpuWithRegisters({ h: 0xfe, l: 0x12 }))
    })
  })
})
