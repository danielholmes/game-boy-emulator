import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { GroupedWordRegister } from "./registers";

export const createPopRr = (
  opCode: OpCode,
  register: GroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `POP ${register}`)
    .loadRegister("sp")
    .readMemoryWord()
    .storeInRegister(register)
    .incrementRegister("sp")
    .incrementRegister("sp");
