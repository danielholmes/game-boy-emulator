import { ByteValue, WordValue } from './types'

export interface Memory {
  raw: number[];
}

export type MemoryAddress = number

export const create = (): Memory => ({
  raw: [] // TODO: Fill with 0?
})

export const writeByte = (memory: Memory, address: MemoryAddress, value: ByteValue): void => {
  memory.raw[address] = value
}

export const readByte = (memory: Memory, address: MemoryAddress): ByteValue =>
  memory.raw[address]

export const readWord = (memory: Memory, address: MemoryAddress): WordValue =>
  readByte(memory, address) + (readByte(memory, address + 1) << 8)

export const writeWord = (memory: Memory, address: MemoryAddress, value: WordValue): void => {
  writeByte(memory, address, value & 255)
  writeByte(memory, address + 1, value >> 8)
}
