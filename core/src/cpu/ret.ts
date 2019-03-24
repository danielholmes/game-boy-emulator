import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const ret = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "RET")
    .loadRegister("sp")
    .readMemoryWord()
    .storeInRegister("pc")
    .incrementRegister("sp")
    .incrementRegister("sp")
    .internalDelay();
