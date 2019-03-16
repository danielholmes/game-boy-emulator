/* global describe, test, expect */

import { Memory } from '../memory'
import { createMemoryWithValues } from '../test/help'

describe('memory', () => {
  let memory: Memory

  beforeEach(() => {
    memory = new Memory()
  })

  describe('writeByte', () => {
    test('success', () => {
      memory.writeByte(0x10, 0xAA)

      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0xAA }))
    })
  })

  describe('writeWord', () => {
    test('success', () => {
      memory.writeWord(0x10, 0xABCD)

      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0xAB, 0x11: 0xCD }))
    })
  })

  describe('byte', () => {
    test('success', () => {
      memory.writeByte(0x10, 0xAA)

      const result = memory.readByte(0x10)

      expect(result).toBe(0xAA)
    })
  })

  describe('word', () => {
    test('success', () => {
      memory.writeWord(0x10, 0xABCD)

      const result = memory.readWord(0x10)

      expect(result).toBe(0xABCD)
    })
  })
})
