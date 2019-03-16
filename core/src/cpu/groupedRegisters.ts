import { WordValue } from '../types'
import { ByteRegister } from './registers'
import { Cpu } from './types'

export type GroupedWordRegister = 'bc' | 'de' | 'hl'

export const GROUPED_WORD_REGISTERS: ReadonlyArray<GroupedWordRegister> = ['bc', 'de', 'hl']

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

export const getGroupedRegister = (cpu: Cpu, register: GroupedWordRegister): WordValue => {
  const [byte1, byte2] = groupedWordByteRegisters(register)
  return (cpu.registers[byte1] << 8) + cpu.registers[byte2]
}

export const setGroupedRegister = (cpu: Cpu, register: GroupedWordRegister, value: WordValue): void => {
  const [byteRegister1, byteRegister2] = groupedWordByteRegisters(register)
  cpu.registers[byteRegister1] = (value >> 8) & 255
  cpu.registers[byteRegister2] = value & 255
}
