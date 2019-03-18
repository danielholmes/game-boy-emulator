/* global describe, test, expect */

import { byteValueToSignedByte } from '../types'

describe('types', () => {
  describe('byteValueToSignedByte', () => {
    test('one', () => {
      const result = byteValueToSignedByte(0x01)

      expect(result).toBe(1)
    })

    test('zero', () => {
      const result = byteValueToSignedByte(0x00)

      expect(result).toBe(0)
    })

    test('negative', () => {
      const result = byteValueToSignedByte(0xFF)

      expect(result).toBe(-1)
    })

    test('max', () => {
      const result = byteValueToSignedByte(0x7F)

      expect(result).toBe(127)
    })

    test('min', () => {
      const result = byteValueToSignedByte(0x80)

      expect(result).toBe(-128)
    })

    test('known example', () => {
      const result = byteValueToSignedByte(0xFB)

      expect(result).toBe(-5)
    })
  })
})
