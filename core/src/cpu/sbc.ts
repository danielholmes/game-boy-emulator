import { Instruction, InstructionDefinition, OpCode } from './instructions'
import { ByteRegister } from './registers'
import { LowLevelOperation, LowLevelState, LowLevelStateReturn } from './lowLevel'
import { Cpu, Cycles } from './types'
import { Memory } from '../memory'

class SbcAR implements LowLevelOperation
{
  public readonly cycles: Cycles = 4
  private readonly register: ByteRegister

  public constructor(register: ByteRegister)
  {
    this.register = register
  }

  public execute(cpu: Cpu, memory: Memory, value: LowLevelState): LowLevelStateReturn {
    const oldA = cpu.registers.a
    cpu.registers.a -= cpu.registers[this.register]
    cpu.registers.a -= (cpu.registers.f & 0x10) ? 1 : 0
    cpu.registers.f = (cpu.registers.a < 0) ? 0x50 : 0x40
    cpu.registers.a &= 0xFF
    if (!cpu.registers.a) {
      cpu.registers.f |= 0x80
    }
    if ((cpu.registers.a ^ cpu.registers[this.register] ^ oldA) & 0x10) {
      cpu.registers.f |= 0x20
    }
  }
}

export const createSbcAR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `SBC a,${register}`, [new SbcAR(register)])
