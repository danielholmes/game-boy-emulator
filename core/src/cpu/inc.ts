import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister, NonAfGroupedWordRegister } from "./registers";

export const createIncRr = (
  opCode: OpCode,
  register: NonAfGroupedWordRegister | "sp"
): Instruction =>
  new InstructionDefinition(opCode, `INC ${register}`)
    .incrementWordRegisterWithFlags(register)
    .internalDelay();

export const createIncR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(
    opCode,
    `INC ${register}`
  ).incrementByteRegisterWithFlags(register);
