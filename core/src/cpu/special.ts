import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export function createNop(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, "NOP");
}

export function ei(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, "EI").setIme(true);
}

export function di(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, "EI").setIme(false);
}
