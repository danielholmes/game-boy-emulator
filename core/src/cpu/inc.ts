import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { GroupedWordRegister, Register } from "./registers";

export const createIncRr = (
  opCode: OpCode,
  register: GroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`).incrementGroupedRegister(
    register
  );

export const createIncR = (opCode: OpCode, register: Register): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`).incrementRegister(
    register
  );

export const createIncSp = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "INC sp").incrementStackPointer();
