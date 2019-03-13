import { Memory } from './memory'
import { partial } from 'lodash'

export type ByteValue = number
export type WordValue = number

export interface CpuRegisters {
  a: ByteValue;
  b: ByteValue;
  c: ByteValue;
  d: ByteValue;
  e: ByteValue;
  h: ByteValue;
  l: ByteValue;

  f: ByteValue;

  pc: WordValue;
  sp: WordValue;
}

export type ByteRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l'
export type GroupedWordRegister = 'bc' | 'de' | 'hl'

export interface Cpu {
  readonly registers: CpuRegisters
}

export const create = (): Cpu => ({
  registers: {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    h: 0,
    l: 0,

    f: 0,

    pc: 0,
    sp: 0
  }
})

export const runInstruction = (cpu: Cpu, memory: Memory): void => {

}

const BC_BYTE_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['b', 'c']
const DE_BYTE_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['d', 'e']
const HL_BYTE_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['h', 'l']

export const groupedWordByteRegisters = (register: GroupedWordRegister): Readonly<[ByteRegister, ByteRegister]> => {
  switch (register) {
    case 'bc':
      return BC_BYTE_REGISTERS
    case 'de':
      return DE_BYTE_REGISTERS
    case 'hl':
      return HL_BYTE_REGISTERS
  }
}

export const setGroupedRegister = (cpu: Cpu, register: GroupedWordRegister, value: number): void => {
  const [byteRegister1, byteRegister2] = groupedWordByteRegisters(register)
  cpu.registers[byteRegister1] = (value >> 8) & 255
  cpu.registers[byteRegister2] = value & 255
}

// TODO: Don't export, test through runInstruction
export const ldNnN = (nn: ByteRegister, cpu: Cpu, memory: Memory, n: ByteValue): void => {
  cpu.registers[nn] = n
}

// TODO: Don't export, test through runInstruction
export const ldNnNWord = (nn: ByteRegister, cpu: Cpu, memory: Memory, n: WordValue): void => {
  cpu.registers[nn] = n & 255
}

// TODO: Don't export, test through runInstruction
export const ldR1R2 = (r1: ByteRegister, r2: ByteRegister, cpu: Cpu, memory: Memory): void => {
  cpu.registers[r1] = cpu.registers[r2]
}

// TODO: Don't export, test through runInstruction
// Not sure how to handle overflow of a 16 bit going in to 8 bit
export const ldR1R2Word = (r1: ByteRegister, r2: GroupedWordRegister, cpu: Cpu, memory: Memory): void => {
  const [r2Byte1, r2Byte2] = groupedWordByteRegisters(r2)
  const wordValue = (cpu.registers[r2Byte1] << 8) + cpu.registers[r2Byte2]
  cpu.registers[r1] = wordValue & 255
}

// TODO: Don't export, test through runInstruction
export const ldR1WordR2 = (r1: GroupedWordRegister, r2: ByteRegister, cpu: Cpu, memory: Memory): void => {
  const [r1Byte1, r1Byte2] = groupedWordByteRegisters(r1)
  cpu.registers[r1Byte1] = 0x00
  cpu.registers[r1Byte2] = cpu.registers[r2]
}

type Operands = number
type Cycles = number
type Instruction = Readonly<[(...args: any[]) => void, Operands, Cycles]>

const INSTRUCTIONS: { [key: number]: Instruction } = {
  0x06: [partial(ldNnN, 'b'), 1, 8],
  0x0E: [partial(ldNnN, 'c'), 1, 8],
  0x16: [partial(ldNnN, 'd'), 1, 8],
  0x1E: [partial(ldNnN, 'e'), 1, 8],
  0x26: [partial(ldNnN, 'h'), 1, 8],
  0x2E: [partial(ldNnN, 'l'), 1, 8],

  0x7F: [partial(ldR1R2, 'a', 'a'), 0, 4],
  0x78: [partial(ldR1R2, 'a', 'b'), 0, 4],
  0x79: [partial(ldR1R2, 'a', 'c'), 0, 4],
  0x7A: [partial(ldR1R2, 'a', 'd'), 0, 4],
  0x7B: [partial(ldR1R2, 'a', 'e'), 0, 4],
  0x7C: [partial(ldR1R2, 'a', 'h'), 0, 4],
  0x7D: [partial(ldR1R2, 'a', 'l'), 0, 4],
  0x7E: [partial(ldR1R2Word, 'a', 'hl'), 0, 8],
  0x40: [partial(ldR1R2, 'b', 'b'), 0, 4],
  0x41: [partial(ldR1R2, 'b', 'c'), 0, 4],
  0x42: [partial(ldR1R2, 'b', 'd'), 0, 4],
  0x43: [partial(ldR1R2, 'b', 'e'), 0, 4],
  0x44: [partial(ldR1R2, 'b', 'h'), 0, 4],
  0x45: [partial(ldR1R2, 'b', 'l'), 0, 4],
  0x46: [partial(ldR1R2, 'b', 'hl'), 0, 8],
  0x48: [partial(ldR1R2, 'c', 'b'), 0, 4],
  0x49: [partial(ldR1R2, 'c', 'c'), 0, 4],
  0x4A: [partial(ldR1R2, 'c', 'd'), 0, 4],
  0x4B: [partial(ldR1R2, 'c', 'e'), 0, 4],
  0x4C: [partial(ldR1R2, 'c', 'h'), 0, 4],
  0x4D: [partial(ldR1R2, 'c', 'l'), 0, 4],
  0x4E: [partial(ldR1R2, 'c', 'hl'), 0, 8],
  0x50: [partial(ldR1R2, 'd', 'b'), 0, 4],
  0x51: [partial(ldR1R2, 'd', 'c'), 0, 4],
  0x52: [partial(ldR1R2, 'd', 'd'), 0, 4],
  0x53: [partial(ldR1R2, 'd', 'e'), 0, 4],
  0x54: [partial(ldR1R2, 'd', 'h'), 0, 4],
  0x55: [partial(ldR1R2, 'd', 'l'), 0, 4],
  0x56: [partial(ldR1R2, 'd', 'hl'), 0, 8],
  0x58: [partial(ldR1R2, 'e', 'b'), 0, 4],
  0x59: [partial(ldR1R2, 'e', 'c'), 0, 4],
  0x5A: [partial(ldR1R2, 'e', 'd'), 0, 4],
  0x5B: [partial(ldR1R2, 'e', 'e'), 0, 4],
  0x5C: [partial(ldR1R2, 'e', 'h'), 0, 4],
  0x5D: [partial(ldR1R2, 'e', 'l'), 0, 4],
  0x5E: [partial(ldR1R2, 'e', 'hl'), 0, 8],
  0x60: [partial(ldR1R2, 'h', 'b'), 0, 4],
  0x61: [partial(ldR1R2, 'h', 'c'), 0, 4],
  0x62: [partial(ldR1R2, 'h', 'd'), 0, 4],
  0x63: [partial(ldR1R2, 'h', 'e'), 0, 4],
  0x64: [partial(ldR1R2, 'h', 'h'), 0, 4],
  0x65: [partial(ldR1R2, 'h', 'l'), 0, 4],
  0x66: [partial(ldR1R2, 'h', 'hl'), 0, 8],
  0x68: [partial(ldR1R2, 'l', 'b'), 0, 4],
  0x69: [partial(ldR1R2, 'l', 'c'), 0, 4],
  0x6A: [partial(ldR1R2, 'l', 'd'), 0, 4],
  0x6B: [partial(ldR1R2, 'l', 'e'), 0, 4],
  0x6C: [partial(ldR1R2, 'l', 'h'), 0, 4],
  0x6D: [partial(ldR1R2, 'l', 'l'), 0, 4],
  0x6E: [partial(ldR1R2, 'l', 'hl'), 0, 8],
  0x70: [partial(ldR1R2, 'hl', 'b'), 0, 8],
  0x71: [partial(ldR1R2, 'hl', 'c'), 0, 8],
  0x72: [partial(ldR1R2, 'hl', 'd'), 0, 8],
  0x73: [partial(ldR1R2, 'hl', 'e'), 0, 8],
  0x74: [partial(ldR1R2, 'hl', 'h'), 0, 8],
  0x75: [partial(ldR1R2, 'hl', 'l'), 0, 8],
  // TODO
  // 0x36: [partial(ldR1R2, 'hl', 'n'), 0, 12]

  0x0A: [partial(ldR1R2Word, 'a', 'bc'), 0, 8],
  0x1A: [partial(ldR1R2Word, 'a', 'de'), 0, 8],
  0x3E: [partial(ldNnN, 'a'), 1, 8],
  0xFA: [partial(ldNnNWord, 'a'), 1, 16],

  0x47: [partial(ldR1R2, 'b', 'a'), 0, 4],
  0x4F: [partial(ldR1R2, 'c', 'a'), 0, 4],
  0x57: [partial(ldR1R2, 'd', 'a'), 0, 4],
  0x5F: [partial(ldR1R2, 'e', 'a'), 0, 4],
  0x67: [partial(ldR1R2, 'h', 'a'), 0, 4],
  0x6F: [partial(ldR1R2, 'l', 'a'), 0, 4],
  0x02: [partial(ldR1WordR2, 'bc', 'a'), 0, 8],
  0x12: [partial(ldR1WordR2, 'de', 'a'), 0, 8],
  0x77: [partial(ldR1WordR2, 'hl', 'a'), 0, 8],
  0xEA: [partial(ldNnNWord, 'a'), 1, 16],
}
