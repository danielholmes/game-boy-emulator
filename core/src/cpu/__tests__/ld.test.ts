/* global describe, test, expect */

import { Memory, create as createMemory, writeByte } from '../../memory'
import each from 'jest-each'
import { BYTE_REGISTER_PAIR_PERMUTATIONS, BYTE_REGISTERS, ByteRegister } from '../registers'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createLdHlR, createLdRHl, createLdRN, createLdRR } from '../ld'
import { createCpuWithRegisters, createMemoryWithValues } from '../../test/help'

const EMPTY_MEMORY = createMemory()

describe('ld', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = createMemory()
  })

  describe('createLdRR', () => {
    each(BYTE_REGISTER_PAIR_PERMUTATIONS.map((p) => p as ReadonlyArray<ByteRegister>)).test(
      'LD %s,%s',
      (register1: ByteRegister, register2: ByteRegister) => {
        cpu.registers[register2] = 0x72

        const instruction = createLdRR(0x3D, register1, register2)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(4)
        expect(cpu).toEqual(createCpuWithRegisters({ [register1]: 0x72, [register2]: 0x72 }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })

  describe('createLdRN', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD %s,n',
      (register: ByteRegister) => {
        cpu.registers.pc = 0x22
        writeByte(memory, 0x22, 0x77)

        const instruction = createLdRN(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x77, pc: 0x23 }))
        expect(memory).toEqual(createMemoryWithValues({ 0x22: 0x77 }))
      }
    )
  })

  describe('createLdRHl', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD %s,(HL)',
      (register: ByteRegister) => {
        cpu.registers.h = 0xF1
        cpu.registers.l = 0x08
        writeByte(memory, 0xF108, 0x77)

        const instruction = createLdRHl(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ h: 0xF1, l: 0x08, [register]: 0x77 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: 0x77 }))
      }
    )
  })

  describe('createLdHlR', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD (HL),%s',
      (register: ByteRegister) => {
        cpu.registers.h = 0xF1
        cpu.registers.l = 0x08
        if (register !== 'h' && register !== 'l') {
          cpu.registers[register] = 0x75
        }

        const instruction = createLdHlR(0x3D, register)

        instruction.execute(cpu, memory)

        console.warn('skipped')
        // expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x75, h: 0xF1, l: 0x08 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: cpu.registers[register] }))
      }
    )
  })
})
