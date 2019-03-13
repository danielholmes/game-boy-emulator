import { Memory } from '../memory'
import { groupedWordByteRegisters, GroupedWordRegister } from './groupedRegisters'
import { Cpu } from './types'

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
