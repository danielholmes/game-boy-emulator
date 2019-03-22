import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const createRlR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `RL ${register}`).rotateLeftThroughCarry(
    register
  );

export const createRlMHl = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "RL (hl)");
