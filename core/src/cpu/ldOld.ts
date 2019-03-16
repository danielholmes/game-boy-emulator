// TODO: Don't export, test through runInstruction
import {
  getGroupedRegister,
  groupedWordByteRegisters,
  GroupedWordRegister,
  setGroupedRegister
} from './groupedRegisters'
import { ByteRegister } from './registers'
import { Memory, MemoryAddress } from '../memory'
import { ByteValue, WordValue } from '../types'
import { Cpu } from './types'

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
  cpu.registers.a = memory.readByte(address) + cpu.registers[register]
}

// TODO: Don't export, test through runInstruction
export const ldRMemAddN = (register: ByteRegister, cpu: Cpu, memory: Memory, address: MemoryAddress): void => {
  memory.writeByte(address + cpu.registers[register], cpu.registers.a)
}

export const ldDAHl = (cpu: Cpu, memory: Memory): void => {
  const addressRegister = 'hl'
  const address = getGroupedRegister(cpu, addressRegister)
  const value = memory.readByte(address)
  cpu.registers.a = value
  setGroupedRegister(cpu, addressRegister, value - 1)
}

export const ldIHl = (cpu: Cpu, memory: Memory): void => {
  // Put A into memory address HL. Increment HL.
  const hl = getGroupedRegister(cpu, 'hl')
  memory.writeByte(hl, cpu.registers.a)
  setGroupedRegister(cpu, 'hl', hl + 1)
}
