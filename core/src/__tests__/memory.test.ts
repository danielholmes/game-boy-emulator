/* global describe, test, expect */

import { Memory, create as createMemory, writeByte, writeWord, readByte, readWord } from '../memory'
import { createMemoryWithValues } from '../test/help'

describe('memory', () => {
  let memory: Memory

  beforeEach(() => {
    memory = createMemory()
  })

  describe('writeByte', () => {
    test('success', () => {
      writeByte(memory, 0x10, 0xAA)

      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0xAA }))
    })
  })

  describe('writeWord', () => {
    test('success', () => {
      writeWord(memory, 0x10, 0xABCD)

      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0xAB, 0x11: 0xCD }))
    })
  })

  describe('byte', () => {
    test('success', () => {
      writeByte(memory, 0x10, 0xAA)

      const result = readByte(memory, 0x10)

      expect(result).toBe(0xAA)
    })
  })

  describe('word', () => {
    test('success', () => {
      writeWord(memory, 0x10, 0xABCD)

      const result = readWord(memory, 0x10)

      expect(result).toBe(0xABCD)
    })
  })
})
