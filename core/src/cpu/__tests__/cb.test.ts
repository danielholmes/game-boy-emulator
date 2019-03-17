/* global describe, test, expect */

import { Memory } from '../../memory'
import each from 'jest-each'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createCpuWithRegisters, EMPTY_MEMORY } from '../../test/help'
import { BYTE_REGISTERS, ByteRegister } from '../registers'
import { createCbBit } from '../cb'

describe('cb', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('createCb', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'CB %s',
      (register: ByteRegister) => {
        cpu.registers[register] = 0x14

        const instruction = createCbBit(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(4)
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x14, f: 0x0090 }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })
})
