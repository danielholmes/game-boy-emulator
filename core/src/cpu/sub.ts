import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const createSubR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `SUB ${register}`)
    .loadRegister(register)
    .compareToRegister("a")
    .storeInRegister("a");

export const createSubMHl = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `SUB (hl)`)
    .loadRegister("hl")
    .readMemory()
    .compareToRegister("a")
    .storeInRegister("a");

export const createSubN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `SUB n`)
    .loadByteOperand()
    .compareToRegister("a")
    .storeInRegister("a");
