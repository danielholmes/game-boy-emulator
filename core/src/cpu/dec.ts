import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const createDecR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(
    opCode,
    `DEC ${register}`
  ).decrementByteRegisterWithFlags(register);
