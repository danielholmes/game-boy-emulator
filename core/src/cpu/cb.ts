import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { Cpu, Cycles } from "./types";
import { Memory } from "../memory";
import { fromPairs } from "lodash";
import { numberToByteHex } from "../types";
import { ByteRegister } from "./registers";

class CbInstruction implements Instruction {
  public readonly opCode: OpCode;
  public readonly label: string = "CB";
  public readonly cycles: Cycles = 4;

  public constructor(opCode: OpCode) {
    this.opCode = opCode;
  }

  public execute(cpu: Cpu, memory: Memory): void {
    const operand = memory.readByte(cpu.registers.pc);
    const subInstruction = CB_INSTRUCTIONS[operand];
    if (!subInstruction) {
      throw new Error(`No instruction for opCode ${numberToByteHex(operand)}`);
    }
    cpu.registers.pc++;
    subInstruction.execute(cpu, memory);
  }
}

export const createCb = (opCode: OpCode): Instruction =>
  new CbInstruction(opCode);

export const createCbBit = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `BIT ${register}`).bitFlags(register);

const CB_INSTRUCTIONS: { [opCode: number]: Instruction } = fromPairs(
  [
    ...([[0x7b, "e"], [0x7c, "h"]] as ReadonlyArray<
      [OpCode, ByteRegister]
    >).map(([opCode, register]) => createCbBit(opCode, register))
  ].map((i: Instruction) => [i.opCode, i])
);

// Z80._r.f&=0x1F;
// Z80._r.f|=0x20;
// Z80._r.f=(Z80._r.h&0x80)?0:0x80;
// Z80._r.m=2; },

// t = self.H & (1 << 7)
// flag = 0b00100000
// flag += ((t & 0xFF) == 0) << flagZ
// self.F &= 0b00010000
// self.F |= flag
// self.PC += 2
// return 0
