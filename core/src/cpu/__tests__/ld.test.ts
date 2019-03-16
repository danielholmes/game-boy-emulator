/* global describe, test, expect */

import { Memory, create as createMemory, writeByte, writeWord, copyMemory } from '../../memory'
import each from 'jest-each'
import { BYTE_REGISTER_PAIR_PERMUTATIONS, BYTE_REGISTERS, ByteRegister } from '../registers'
import { Cpu } from '../types'
import { copyCpu, create as createCpu } from '../'
import {
  createLdAMNn,
  createLdGrM,
  createLdHlMN,
  createLdHlMR, createLdMNnA,
  createLdMRA,
  createLdRHlM,
  createLdRN,
  createLdRR
} from '../ld'
import { createCpuWithRegisters, createMemoryWithValues } from '../../test/help'
import { groupedWordByteRegisters, GroupedWordRegister } from '../groupedRegisters'

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

  describe('createLdRHlM', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD %s,(hl)',
      (register: ByteRegister) => {
        cpu.registers.h = 0xF1
        cpu.registers.l = 0x08
        writeByte(memory, 0xF108, 0x77)

        const instruction = createLdRHlM(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ h: 0xF1, l: 0x08, [register]: 0x77 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: 0x77 }))
      }
    )
  })

  describe('createLdHlMR', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD (hl),%s',
      (register: ByteRegister) => {
        cpu.registers.h = 0xF1
        cpu.registers.l = 0x08
        if (register !== 'h' && register !== 'l') {
          cpu.registers[register] = 0x75
        }

        const instruction = createLdHlMR(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x75, h: 0xF1, l: 0x08 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: cpu.registers[register] }))
      }
    )
  })

  describe('createLdHlMN', () => {
    test('LD (hl),n', () => {
        cpu.registers.h = 0xF1
        cpu.registers.l = 0x08
        cpu.registers.pc = 0xCC
        writeByte(memory, 0xCC, 0xB1)

        const instruction = createLdHlMN(0x3D)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(12)
        expect(cpu).toEqual(createCpuWithRegisters({ pc: 0xCD, h: 0xF1, l: 0x08 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: 0xB1, 0xCC: 0xB1 }))
      }
    )
  })

  describe('createLdGrM', () => {
    each([['bc'], ['de']]).test(
      'LD a,(%s)',
      (register: GroupedWordRegister) => {
        const [byte1, byte2] = groupedWordByteRegisters(register)
        cpu.registers[byte1] = 0xF1
        cpu.registers[byte2] = 0x08
        writeByte(memory, 0xF108, 0x2D)
        const memorySnapshot = copyMemory(memory)

        const instruction = createLdGrM(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ a: 0x2D, [byte1]: 0xF1, [byte2]: 0x08 }))
        expect(memory).toEqual(memorySnapshot)
      }
    )
  })

  describe('createLdAMNn', () => {
    test('LD a,(nn)', () => {
      cpu.registers.pc = 0xCC
      writeWord(memory, 0xCC, 0xB116)
      writeWord(memory, 0xB116, 0xAA21)

      const memorySnapshot = copyMemory(memory)
      const instruction = createLdAMNn(0x3D)

      instruction.execute(cpu, memory)

      expect(instruction.cycles).toBe(16)
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0xCE, a: 0x21 }))
      expect(memory).toEqual(memorySnapshot)
      }
    )
  })

  describe('createLdMRA', () => {
    each([['bc'], ['de']]).test(
      'LD (%s),a',
      (register: GroupedWordRegister) => {
        const [byte1, byte2] = groupedWordByteRegisters(register)
        cpu.registers[byte1] = 0xF1
        cpu.registers[byte2] = 0x08
        cpu.registers.a = 0x56

        const instruction = createLdMRA(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(8)
        expect(cpu).toEqual(createCpuWithRegisters({ a: 0x56, [byte1]: 0xF1, [byte2]: 0x08 }))
        expect(memory).toEqual(createMemoryWithValues({ 0xF108: 0x56 }))
      }
    )
  })

  describe('createLdMNnA', () => {
    test('LD (nn),a', () => {
      cpu.registers.a = 0x32
      cpu.registers.pc = 0xCC
      writeWord(memory, 0xCC, 0xB116)

      const cpuSnapshot = copyCpu(cpu)
      const instruction = createLdMNnA(0x3D)

      instruction.execute(cpu, memory)

      expect(instruction.cycles).toBe(16)
      expect(cpu).toEqual(cpuSnapshot)
      expect(memory).toEqual(createMemoryWithValues({ 0xCC: 0xB1, 0xCD: 0x16, 0xB116: 0x32 }))
      }
    )
  })
})
