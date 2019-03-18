/* global describe, expect */

import { Memory } from '../../memory'
import each from 'jest-each'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createCpuWithRegisters } from '../../test/help'
import { BYTE_REGISTERS, ByteRegister } from '../registers'
import { createDecR } from '../dec'

describe('dec', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('createDecR', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'DEC %s',
      (register: ByteRegister) => {
        cpu.registers[register] = 0x0014

        const instruction = createDecR(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(4)
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x0013 }))
        expect(memory).toEqual(new Memory())
      }
    )
  })
})
