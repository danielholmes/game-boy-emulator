import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createCallNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, 'CALL nn')
    .decrementStackPointer(0x0002)
    .loadProgramCounter()
    .writeMemoryWordFromStackPointer()
    .loadWordOperand()
    .storeInRegister('pc');

// call to nn, SP=SP-2, (SP)=PC, PC=nn
