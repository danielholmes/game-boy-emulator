import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createJrNzN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "JR cc,nn")
    .loadSignedByteOperand()
    .jrCheck();
