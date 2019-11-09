import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { Mmu } from "../memory/mmu";
import { fromPairs } from "lodash";
import { ByteBitPosition } from "../types";
import { ByteRegister } from "./registers";
import { Cpu, ClockCycles } from "./index";
import { createRlMHl, createRlR } from "./rl";
import { toByteHexString } from "../utils/numberUtils";

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
        `No instruction for CB opCode ${toByteHexString(operand)}`
      );
    }
    cpu.registers.pc++;
    subInstruction.execute(cpu, mmu);
    return 4;
  }
}

export const createCb = (opCode: OpCode): Instruction =>
  new CbInstruction(opCode);

export const createCbBitBR = (
  opCode: OpCode,
  position: ByteBitPosition,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `BIT ${position}, ${register}`)
    .loadRegister(register)
    .bitFlags(position);

export const createCbBitBMHl = (
  opCode: OpCode,
  position: ByteBitPosition
): Instruction =>
  new InstructionDefinition(opCode, `BIT ${position}, (hl)`)
    .loadRegister("hl")
    .readMemory()
    .bitFlags(position);

const CB_INSTRUCTIONS: { [opCode: number]: Instruction } = fromPairs(
  [
    ...([
      [0x40, 0, "b"],
      [0x41, 0, "c"],
      [0x42, 0, "d"],
      [0x43, 0, "e"],
      [0x44, 0, "h"],
      [0x45, 0, "l"],
      [0x47, 0, "a"],

      [0x48, 1, "b"],
      [0x49, 1, "c"],
      [0x4a, 1, "d"],
      [0x4b, 1, "e"],
      [0x4c, 1, "h"],
      [0x4d, 1, "l"],
      [0x4f, 1, "a"],

      [0x50, 2, "b"],
      [0x51, 2, "c"],
      [0x52, 2, "d"],
      [0x53, 2, "e"],
      [0x54, 2, "h"],
      [0x55, 2, "l"],
      [0x57, 2, "a"],

      [0x58, 3, "b"],
      [0x59, 3, "c"],
      [0x5a, 3, "d"],
      [0x5b, 3, "e"],
      [0x5c, 3, "h"],
      [0x5d, 3, "l"],
      [0x5f, 3, "a"],

      [0x60, 4, "b"],
      [0x61, 4, "c"],
      [0x62, 4, "d"],
      [0x63, 4, "e"],
      [0x64, 4, "h"],
      [0x65, 4, "l"],
      [0x67, 4, "a"],

      [0x68, 5, "b"],
      [0x69, 5, "c"],
      [0x6a, 5, "d"],
      [0x6b, 5, "e"],
      [0x6c, 5, "h"],
      [0x6d, 5, "l"],
      [0x6f, 5, "a"],

      [0x70, 6, "b"],
      [0x71, 6, "c"],
      [0x72, 6, "d"],
      [0x73, 6, "e"],
      [0x74, 6, "h"],
      [0x75, 6, "l"],
      [0x77, 6, "a"],

      [0x78, 7, "b"],
      [0x79, 7, "c"],
      [0x7a, 7, "d"],
      [0x7b, 7, "e"],
      [0x7c, 7, "h"],
      [0x7d, 7, "l"],
      [0x7f, 7, "a"]
    ] as readonly [
      OpCode,
      ByteBitPosition,
      ByteRegister
    ][]).map(([opCode, position, register]) =>
      createCbBitBR(opCode, position, register)
    ),

    ...([
      [0x46, 0],
      [0x4e, 1],
      [0x56, 2],
      [0x5e, 3],
      [0x66, 4],
      [0x6e, 5],
      [0x76, 6],
      [0x7e, 7]
    ] as readonly [OpCode, ByteBitPosition][]).map(([opCode, position]) =>
      createCbBitBMHl(opCode, position)
    ),

    ...([
      [0x17, "a"],
      [0x10, "b"],
      [0x11, "c"],
      [0x12, "d"],
      [0x13, "e"],
      [0x14, "h"],
      [0x15, "l"]
    ] as readonly [OpCode, ByteRegister][]).map(([opCode, register]) =>
      createRlR(opCode, register)
    ),

    createRlMHl(0x16)
  ].map((i: Instruction) => [i.opCode, i])
);
