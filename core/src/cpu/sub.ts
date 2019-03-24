import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const subR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `SUB ${register}`)
    .loadRegister(register)
    .compareToRegister("a")
    .storeInRegister("a");

export const subMHl = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `SUB (hl)`)
    .loadRegister("hl")
    .readMemory()
    .compareToRegister("a")
    .storeInRegister("a");

export const subN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `SUB n`)
    .loadByteOperand()
    .compareToRegister("a")
    .storeInRegister("a");
