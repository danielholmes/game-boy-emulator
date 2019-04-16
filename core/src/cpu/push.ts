import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { GroupedWordRegister } from "./registers";

// See for timings and write test:
// https://gekkio.fi/blog/2015-01-13-mooneye-gb-a-gameboy-emulator-written-in-rust.html

export const push = (
  opCode: OpCode,
  register: GroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `PUSH ${register}`)
    .internalDelay()
    .loadRegister(register)
    .pushWordToStack();
