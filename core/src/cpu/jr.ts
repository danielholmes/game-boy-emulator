import { Instruction, InstructionDefinition, OpCode } from './instructions'

export const createJrNzN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, 'JR cc,n')
    .loadProgramCounter()
    .readMemory()
    .jrCheck()
    .incrementProgramCounterFlagCheck(0x80, 0x00)
