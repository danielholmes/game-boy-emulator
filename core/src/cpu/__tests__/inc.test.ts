/* global describe, test, expect */

import { Memory } from '../../memory'
import each from 'jest-each'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createCpuWithRegisters } from '../../test/help'
import {
  GROUPED_WORD_REGISTERS,
  groupedWordByteRegisters,
  GroupedWordRegister,
  setGroupedRegister
} from '../groupedRegisters'
import { createIncRr } from '../inc'

describe('inc', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('createIncRr', () => {
    each(GROUPED_WORD_REGISTERS.map((r) => [r])).test(
      'INC %s',
      (register: GroupedWordRegister) => {
        const [byte1, byte2] = groupedWordByteRegisters(register)
        setGroupedRegister(cpu, register, 0x2314)

        const instruction = createIncRr(0x3D, register)

        instruction.execute(cpu, memory)

        expect(instruction.cycles).toBe(4)
        expect(cpu).toEqual(createCpuWithRegisters({ [byte1]: 0x23, [byte2]: 0x15 }))
        expect(memory).toEqual(new Memory())
      }
    )
  })
})
