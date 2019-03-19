import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { Mmu } from "../memory/mmu";
import { fromPairs } from "lodash";
import { numberToByteHex } from "../types";
import { ByteRegister } from "./registers";
import { Cpu, ClockCycles } from "./index";
import { createRlR } from "./rl";

class CbInstruction implements Instruction {
  public readonly opCode: OpCode;
  public readonly label: string = "CB";

  public constructor(opCode: OpCode) {
    this.opCode = opCode;
  }

  public execute(cpu: Cpu, mmu: Mmu): ClockCycles {
    const operand = mmu.readByte(cpu.registers.pc);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const subInstruction = CB_INSTRUCTIONS[operand];
    if (!subInstruction) {
      throw new Error(
        `No instruction for CB opCode ${numberToByteHex(operand)}`
      );
    }
    cpu.registers.pc++;
    subInstruction.execute(cpu, mmu);
    return 4;
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
    >).map(([opCode, register]) => createCbBit(opCode, register)),

    ...([
      [0x17, "a"],
      [0x10, "b"],
      [0x11, "c"],
      [0x12, "d"],
      [0x13, "e"],
      [0x14, "h"],
      [0x15, "l"],
    ] as ReadonlyArray<[OpCode, ByteRegister]>
    ).map(([opCode, register]) => createRlR(opCode, register))
  ].map((i: Instruction) => [i.opCode, i]),
);
