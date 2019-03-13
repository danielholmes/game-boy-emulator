export interface Memory {
  raw: number[];
}

export type MemoryAddress = number

export const create = (): Memory => ({
  raw: []
})

export const writeByte = (memory: Memory, address: MemoryAddress, value: number): void => {
  memory.raw[address] = value
}

export const readByte = (memory: Memory, address: MemoryAddress): number =>
  memory.raw[address]
