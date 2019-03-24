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

export type DecRrRegister = "bc" | "de" | "hl" | "sp";

export const createDecRr = (
  opCode: OpCode,
  register: DecRrRegister
): Instruction =>
  new InstructionDefinition(opCode, `DEC ${register}`)
    .decrementRegister(register)
    .internalDelay();
