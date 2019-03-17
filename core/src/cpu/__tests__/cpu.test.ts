/* global describe, test, expect */

import { Memory, MemoryAddress } from '../../memory'
import bios from '../../bios'
import { create as createCpu, runInstruction } from '../'
import { Cpu } from '../types'
import { createCpuWithRegisters, createMemoryWithValues } from '../../test/help'
import { toPairs, sortBy } from 'lodash'
import { ByteValue, formatByte, formatWord } from '../../types'

describe('cpu', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('runInstruction', () => {
    test('runs NOP', () => {
      memory.writeByte(0x10, 0x00)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x11 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x00 }))
    })

    test('runs single operand', () => {
      memory.writeByte(0x10, 0x06)
      memory.writeByte(0x11, 0x66)
      cpu.registers.pc = 0x10

      runInstruction(cpu, memory)

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })

    test('runs smoke test on bios', () => {
      bios.forEach((value, address) => {
        memory.writeByte(address, value)
      })

      while (cpu.registers.pc <= bios.length) {
        console.log(
          'PC 0x' + cpu.registers.pc.toString(16).toUpperCase(),
          'OP 0x' + memory.readByte(cpu.registers.pc).toString(16),
          'Bios length: ' + bios.length
        )
        /*console.log(
          sortBy(
            toPairs(memory.getValues())
              .filter(([, value]) => value !== undefined),
            ([address, ]) => address
          )
            .filter(([address,]) => parseInt(address) >= 0xFF)
            .map(([address, value]) =>
              `${formatWord(parseInt(address))}: ${formatByte(value)}`
            )
        )*/
        runInstruction(cpu, memory)
      }

      // expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x12 }))
      // expect(memory).toEqual(createMemoryWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    })
  })
})
