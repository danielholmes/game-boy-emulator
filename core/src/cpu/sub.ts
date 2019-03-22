import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";

export const createSubR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `SUB ${register}`)
    .loadRegister(register)
    .subtractFromRegister('a');

export const createSubMHl = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `SUB (hl)`)
    .loadRegister('hl')
    .readMemory()
    .subtractFromRegister('a');
