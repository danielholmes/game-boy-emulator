/* global describe, test, expect */

import { Memory } from '../../memory'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { createIncSp } from '../inc'
import { createNop } from '../special'

describe('special', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('createIncSp', () => {
    test('success', () => {
      const instruction = createNop(0x00)

      instruction.execute(cpu, memory)

      expect(instruction.cycles).toBe(4)
      expect(cpu).toEqual(createCpu())
      expect(memory).toEqual(new Memory())
    })
  })
})
