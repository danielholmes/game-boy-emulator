/* global describe, expect */

import { Memory } from '../../memory'
import each from 'jest-each'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createCpuWithRegisters, EMPTY_MEMORY } from '../../test/help'
import { BYTE_REGISTERS, ByteRegister } from '../registers'
import { createXorR } from '../xor'

describe('xor', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('createXorR', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'XOR %s',
      (register: ByteRegister) => {
        cpu.registers.a = 0x01
        cpu.registers[register] = 0x12

        const instruction = createXorR(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(4)
        expect(cpu).toEqual(createCpuWithRegisters({ a: 0x12, [register]: 0x12 }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })
})
