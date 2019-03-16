/* global describe, test, expect */

import { Memory } from '../../memory'
import { Cpu } from '../types'
import { create as createCpu } from '../'
import { setGroupedRegister } from '../groupedRegisters'
import { createCpuWithRegisters } from '../../test/help'

describe('cpu', () => {
  let cpu: Cpu
  let memory: Memory

  beforeEach(() => {
    cpu = createCpu()
    memory = new Memory()
  })

  describe('setGroupedRegister', () => {
    test('set hl', () => {
      setGroupedRegister(cpu, 'hl', 0xfe12)

      expect(cpu).toEqual(createCpuWithRegisters({ h: 0xfe, l: 0x12 }))
    })
  })
})
