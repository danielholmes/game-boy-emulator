import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export function createCpR(opCode: OpCode, register: ByteRegister): Instruction {
  return new InstructionDefinition(opCode, `CP ${register}`)
    .loadRegister(register)
    .compareToRegister("a");
}

export function createCpMHl(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `CP (hl)`)
    .loadRegister("hl")
    .readMemory()
    .compareToRegister("a");
}

export function createCpN(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `CP n`)
    .loadByteOperand()
    .compareToRegister("a");
}
