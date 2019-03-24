import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { CheckFlag } from "./lowLevel";

export const createJrCcN = (opCode: OpCode, flag: CheckFlag): Instruction =>
  new InstructionDefinition(opCode, `JR ${flag},n`)
    .loadSignedByteOperand()
    .addToPcIfFlag(flag);

// M = 1: n read: memory access
// ; cc matches or unconditional
// M = 2: internal delay

export const createJrN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "JR n")
    .loadSignedByteOperand()
    .addToRegister("pc");
