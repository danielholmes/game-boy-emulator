import { Instruction, InstructionDefinition, OpCode } from './instructions'
import { GroupedWordRegister } from './groupedRegisters'

export const createIncRr = (opCode: OpCode, register: GroupedWordRegister): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`)
    .incrementGroupedRegister(register)
