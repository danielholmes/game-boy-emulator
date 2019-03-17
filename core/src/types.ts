import { padStart } from 'lodash'

export type ByteValue = number
export type WordValue = number

const formatBits = (value: number, length: number): string =>
  `0x${padStart(value.toString(16).toUpperCase(), length, '0')}`

export const formatByte = (value: ByteValue): string => formatBits(value, 2)

export const formatWord = (value: WordValue): string => formatBits(value, 4)
