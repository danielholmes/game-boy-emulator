import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createCallNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, "CALL nn")
    .loadProgramCounter()
    .pushWordToStack()
    .internalDelay()
    .loadWordOperand()
    .storeInRegister("pc");

// TODO: Ordering is wrong
// M = 0: instruction decoding
// M = 1: nn read: memory access for low byte
// M = 2: nn read: memory access for high byte
// ; cc matches or unconditional
// M = 3: internal delay
// M = 4: PC push: memory access for high byte
// M = 5: PC push: memory access for low byte
