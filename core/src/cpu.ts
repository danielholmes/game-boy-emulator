import { Memory, MemoryAddress, readByte, writeByte, writeWord } from './memory'
import { partial } from 'lodash'
import { ByteValue, WordValue } from './types'

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
  readonly registers: CpuRegisters;
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
  const opCode = readByte(memory, cpu.registers.pc)
  const instruction = INSTRUCTIONS[opCode]
  if (!instruction) {
    throw new Error(`No instruction for opCode 0x${opCode.toString(16)}`)
  }

  switch (instruction[1]) {
    case 0:
      instruction[0](cpu, memory)
      break;
    case 1:
      instruction[0](cpu, memory, readByte(memory, cpu.registers.pc + 1))
      break;
  }
  cpu.registers.pc = (cpu.registers.pc + 1 + instruction[1]) & 0xFFFF // Mask to 16 bits

  // TODO: Add cycles
  //Z80._clock.m += Z80._r.m;                  // Add time to CPU clock
  //Z80._clock.t += Z80._r.t;
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

const getGroupedRegister = (cpu: Cpu, register: GroupedWordRegister): WordValue => {
  const [byte1, byte2] = groupedWordByteRegisters(register)
  return (cpu.registers[byte1] << 8) + cpu.registers[byte2]
}

export const setGroupedRegister = (cpu: Cpu, register: GroupedWordRegister, value: WordValue): void => {
  const [byteRegister1, byteRegister2] = groupedWordByteRegisters(register)
  cpu.registers[byteRegister1] = (value >> 8) & 255
  cpu.registers[byteRegister2] = value & 255
}

// TODO: Don't export, test through runInstruction
export const ldNnN = (nn: ByteRegister, cpu: Cpu, memory: Memory, n: ByteValue): void => {
  cpu.registers[nn] = n
}

// TODO: Don't export, test through runInstruction
export const ldWordNnN = (n: GroupedWordRegister | 'sp', cpu: Cpu, memory: Memory, nn: WordValue): void => {
  if (n === 'sp') {
    cpu.registers[n] = nn
  } else {
    setGroupedRegister(cpu, n, nn)
  }
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
  const wordValue = getGroupedRegister(cpu, r2)
  cpu.registers[r1] = wordValue & 255
}

// TODO: Don't export, test through runInstruction
export const ldR1WordR2 = (r1: GroupedWordRegister, r2: ByteRegister, cpu: Cpu): void => {
  const [r1Byte1, r1Byte2] = groupedWordByteRegisters(r1)
  cpu.registers[r1Byte1] = 0x00
  cpu.registers[r1Byte2] = cpu.registers[r2]
}

// TODO: Don't export, test through runInstruction
export const ldMemAddN = (register: ByteRegister, cpu: Cpu, memory: Memory, address: MemoryAddress): void => {
  cpu.registers.a = readByte(memory, address) + cpu.registers[register]
}

// TODO: Don't export, test through runInstruction
export const ldRMemAddN = (register: ByteRegister, cpu: Cpu, memory: Memory, address: MemoryAddress): void => {
  writeByte(memory, address + cpu.registers[register], cpu.registers.a)
}

export const ldDAHl = (cpu: Cpu, memory: Memory): void => {
  const addressRegister = 'hl'
  const address = getGroupedRegister(cpu, addressRegister)
  const value = readByte(memory, address)
  cpu.registers.a = value
  setGroupedRegister(cpu, addressRegister, value - 1)
}

export const ldIHl = (cpu: Cpu, memory: Memory): void => {
  // Put A into memory address HL. Increment HL.
  const hl = getGroupedRegister(cpu, 'hl')
  writeByte(memory, hl, cpu.registers.a)
  setGroupedRegister(cpu, 'hl', hl + 1)
}

export const incWord = (register: GroupedWordRegister | 'sp', cpu: Cpu, memory: Memory): void => {
  if (register === 'sp') {
    cpu.registers.sp = (cpu.registers.sp + 1) & 65535
  } else {
    const [rByte1, rByte2] = groupedWordByteRegisters(register)
    cpu.registers[rByte2] = (cpu.registers[rByte2] + 1) & 255
    if (!cpu.registers[rByte2]) {
      cpu.registers[rByte1] = (cpu.registers[rByte1] + 1) & 255
    }
  }
}

const nop = (): void => {}

// Internal
const rsv = (cpu: Cpu): void => {
  /*Z80._rsv.a = Z80._r.a; Z80._rsv.b = Z80._r.b;
  Z80._rsv.c = Z80._r.c; Z80._rsv.d = Z80._r.d;
  Z80._rsv.e = Z80._r.e; Z80._rsv.f = Z80._r.f;
  Z80._rsv.h = Z80._r.h; Z80._rsv.l = Z80._r.l;*/
}

const rst = (cpu: Cpu, memory: Memory): void => {
  rsv(cpu)
  cpu.registers.sp -= 2
  writeWord(memory, cpu.registers.sp, cpu.registers.pc)
  cpu.registers.pc = 0x38
}

type Cycles = number
type Instruction = Readonly<[(cpu: Cpu, memory: Memory) => void, 0, Cycles]> |
  Readonly<[(cpu: Cpu, memory: Memory, value: number) => void, 1, Cycles]>

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

  0xF2: [partial(ldMemAddN, 'c'), 1, 8],

  0xE2: [partial(ldRMemAddN, 'c'), 1, 8],

  0x3A: [ldDAHl, 0, 8],
  // Not sure what these are
  /* LD A,(HLD) 3A 8
   LD A,(HL-) 3A 8
   LDD A,(HL) 3A 8 */

  // Up to page 72

  // Started again at page 76
  0x01: [partial(ldWordNnN, 'bc'), 1, 12],
  0x11: [partial(ldWordNnN, 'de'), 1, 12],
  0x21: [partial(ldWordNnN, 'hl'), 1, 12],
  0x31: [partial(ldWordNnN, 'sp'), 1, 12],

  // Put A into memory address HL. Increment HL.
  0x22: [ldIHl, 0, 8],

  0x03: [partial(incWord, 'bc'), 0, 8],
  0x13: [partial(incWord, 'de'), 0, 8],
  0x23: [partial(incWord, 'hl'), 0, 8],
  0x33: [partial(incWord, 'sp'), 0, 8],

  0x00: [nop, 0, 4],

  0xFF: [partial(rst), 1, 32]
}
