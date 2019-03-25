import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ReadonlyUint16Array } from "../types";

export type RstAddress =
  | 0x0000
  | 0x0008
  | 0x0010
  | 0x0018
  | 0x0020
  | 0x0028
  | 0x0030
  | 0x0038;
export const RST_ADDRESSES: ReadonlyUint16Array = new Uint16Array([
  0x0000,
  0x0008,
  0x0010,
  0x0018,
  0x0020,
  0x0028,
  0x0030,
  0x0038
]);

export const createRst = (opCode: OpCode, address: RstAddress): Instruction =>
  new InstructionDefinition(opCode, `RST $${address.toString(16)}`)
    .internalDelay()
    .loadProgramCounter()
    .decrementRegister("sp")
    .decrementRegister("sp")
    .writeMemoryWordFromStackPointer()
    .setRegister("pc", address);
