import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { GroupedWordRegister } from "./registers";

export const createPush = (
  opCode: OpCode,
  register: GroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `PUSH ${register}`)
    .internalDelay()
    .loadRegister(register)
    .pushWordToStack();
