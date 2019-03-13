/* global describe, test, expect */

import {
  ByteRegister,
  Cpu,
  CpuRegisters,
  create as createCpu,
  ldNnN,
  ldR1R2,
  ldR1R2Word,
  GroupedWordRegister, setGroupedRegister, groupedWordByteRegisters, ldMemAddN, runInstruction
} from '../cpu'
import { Memory, create as createMemory, writeByte } from '../memory'
import { flatMap, toPairs } from 'lodash'
import each from 'jest-each'
import bios from '../bios'

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

const createMemoryWithValues = (values: { [address: number]: number }): Memory => {
  const memory = createMemory()
  toPairs(values)
    .forEach(([address, value]) => writeByte(memory, parseInt(address), value))
  return memory
}

const EMPTY_MEMORY = createMemory()

const BYTE_REGISTERS: ReadonlyArray<ByteRegister> = ['a', 'b', 'c', 'd', 'e', 'h', 'l']

const VIRTUAL_WORD_REGISTERS: ReadonlyArray<GroupedWordRegister> = ['bc', 'de', 'hl']

const BYTE_REGISTER_PAIRS: ByteRegister[][] =
  flatMap(
    BYTE_REGISTERS.map((r1) =>
      BYTE_REGISTERS.map((r2) => [r1, r2] as Readonly<[ByteRegister, ByteRegister]>)
    )
  )

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

  describe('ldNnN', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD nn,n with register %s',
      (register: ByteRegister) => {
        ldNnN(register, cpu, memory, 0x3D)

        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x3D }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })

  describe('ldR1R2', () => {
    each(BYTE_REGISTER_PAIRS).test(
      'LD r1,r2 with registers %s,%s',
      (register1: ByteRegister, register2: ByteRegister) => {
        cpu.registers[register2] = 0x1E

        ldR1R2(register1, register2, cpu, memory)

        expect(cpu).toEqual(createCpuWithRegisters({ [register1]: 0x1E, [register2]: 0x1E }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })

  describe('ldR1R2Word', () => {
    each(flatMap(BYTE_REGISTERS.map((r1) => VIRTUAL_WORD_REGISTERS.map((r2) => [r1, r2])))).test(
      'LD r1,r2 word with registers %s,%s',
      (register1: ByteRegister, register2: GroupedWordRegister) => {
        const [register2A, register2B] = groupedWordByteRegisters(register2)
        cpu.registers[register2A] = 0x1E
        cpu.registers[register2B] = 0x91

        ldR1R2Word(register1, register2, cpu, memory)

        expect(cpu).toEqual(createCpuWithRegisters({
          [register2A]: 0x1E,
          [register2B]: 0x91,
          [register1]: 0x91
        }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )
  })

  describe('ldMemAddN', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test(
      'LD Mem + N with %s',
      (register: ByteRegister) => {
        cpu.registers[register] = 0x43
        writeByte(memory, 0x1234, 0x12)

        ldMemAddN(register, cpu, memory, 0x1234)

        expect(cpu).toEqual(createCpuWithRegisters({
          [register]: 0x43,
          a: 0x55
        }))
        expect(memory).toEqual(createMemoryWithValues({ 0x1234: 0x12 }))
      }
    )
  })

  describe('runInstruction', () => {
    test('runs NOP', () => {
      writeByte(memory, 0x10, 0x00)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x11 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x00 }))
    })

    test('runs single operand', () => {
      writeByte(memory, 0x10, 0x06)
      writeByte(memory, 0x11, 0x66)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })

    test('runs bios', () => {
      bios.forEach((value, address) => {
        writeByte(memory, address, value)
      })

      while (cpu.registers.pc < bios.length) {
        console.log(cpu.registers.pc, bios.length)
        runInstruction(cpu, memory)
      }

      // expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      // expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })
  })
})
