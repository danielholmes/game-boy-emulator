/* global describe, test, expect */

import {
  ByteRegister,
  Cpu,
  CpuRegisters,
  create as createCpu,
  ldNnN,
  ldR1R2,
  ldR1R2Word,
  GroupedWordRegister, setGroupedRegister, groupedWordByteRegisters
} from '../cpu'
import { Memory, create as createMemory } from '../memory'
import { flatMap } from 'lodash'
import each from 'jest-each'

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

const EMPTY_MEMORY = createMemory()

const BYTE_REGISTERS: ReadonlyArray<ByteRegister> = ['a', 'b', 'c', 'd', 'e', 'h', 'l']

const VIRTUAL_WORD_REGISTERS: ReadonlyArray<GroupedWordRegister> = ['bc', 'de', 'hl']

const BYTE_REGISTER_PAIRS: Array<Array<ByteRegister>> =
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

  describe('runInstruction', () => {
    each(BYTE_REGISTERS.map((r) => [r])).test.only(
      'LD nn,n with register %s',
      (register: ByteRegister) => {
        ldNnN(register, cpu, memory, 0x3D)

        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x3D }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )

    each(BYTE_REGISTER_PAIRS).test.only(
      'LD r1,r2 with registers %s,%s',
      (register1: ByteRegister, register2: ByteRegister) => {
        cpu.registers[register2] = 0x1E

        ldR1R2(register1, register2, cpu, memory)

        expect(cpu).toEqual(createCpuWithRegisters({ [register1]: 0x1E, [register2]: 0x1E }))
        expect(memory).toEqual(EMPTY_MEMORY)
      }
    )

    each(flatMap(BYTE_REGISTERS.map((r1) => VIRTUAL_WORD_REGISTERS.map((r2) => [r1, r2])))).test.only(
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
})
