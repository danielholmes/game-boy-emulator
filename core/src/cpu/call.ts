import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { CheckFlag } from "./lowLevel";

export const createCallNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "CALL nn")
    .loadProgramCounter()
    .pushWordToStack()
    .internalDelay()
    .loadWordOperand()
    .storeInRegister("pc");

export const createCallFNn = (opCode: OpCode, flag: CheckFlag): Instruction =>
  new InstructionDefinition(opCode, `CALL ${flag},nn`)
    .loadWordOperand()
    .setToPcIfFlag(flag);

// TODO: Only load word IF needed, thus changes cycles depending on call

// TODO: See tests mentioned here: https://github.com/Gekkio/mooneye-gb/blob/master/docs/accuracy.markdown#what-is-the-exact-timing-of-calljpjr-not-jp-hl
// TODO: Ordering is wrong
// M = 0: instruction decoding
// M = 1: nn read: memory access for low byte
// M = 2: nn read: memory access for high byte
// ; cc matches or unconditional
// M = 3: internal delay
// M = 4: PC push: memory access for high byte
// M = 5: PC push: memory access for low byte
