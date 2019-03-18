import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { NonAfGroupedWordRegister, Register } from "./registers";

export const createIncRr = (
  opCode: OpCode,
  register: NonAfGroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`).incrementRegister(
    register
  );

export const createIncR = (opCode: OpCode, register: Register): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`).incrementRegister(
    register
  );

export const createIncSp = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "INC sp")
    .incrementRegister("sp")
    .internalDelay();
