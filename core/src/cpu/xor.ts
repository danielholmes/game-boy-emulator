import { Instruction, InstructionDefinition, OpCode } from './instructions'
import { ByteRegister } from './registers'

export const createXorR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `XOR ${register}`)
    .xOr(register)
