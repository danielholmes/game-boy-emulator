import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const createCpR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `CP ${register}`)
    .loadRegister(register)
    .compareToRegister("a");

export const createCpMHl = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `CP (hl)`)
    .loadRegister("hl")
    .readMemory()
    .compareToRegister("a");

export const createCpN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `CP n`)
    .loadByteOperand()
    .compareToRegister("a");
