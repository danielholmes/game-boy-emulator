import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createNop = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "NOP").nop();
