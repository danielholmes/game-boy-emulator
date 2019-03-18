import { padStart } from 'lodash'

export type ByteValue = number
export type SignedByteValue = number
export type WordValue = number
export type BitValue = 1 | 0

export const byteValueToSignedByte = (value: WordValue): SignedByteValue => {
  if ((value & 0x80) !== 0) {
    return -(~value & 0xFF) - 1
  }
  return value & 0xFF
}

export const binaryToWord = (binary: number): WordValue => {
  return parseInt(binary.toString(), 2)
}

const toHex = (value: number, length: number): string => {
  const sign = value >= 0 ? '' : '-'
  return `${sign}0x${padStart(Math.abs(value).toString(16).toUpperCase(), length, '0')}`
}

export const numberToByteHex = (value: ByteValue): string => toHex(value, 2)

export const numberToWordHex = (value: WordValue): string => toHex(value, 4)

export const numberToByteBinary = (value: ByteValue | WordValue): string =>
  value.toString(2).padStart(8, '0')
