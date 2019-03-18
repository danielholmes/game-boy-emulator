import { Mmu } from "../memory/mmu";
import { fromPairs } from "lodash";
import { Instruction, OpCode } from "./instructions";
import {
  createLddMHlA,
  createLdGrNn,
  createLdHlMR,
  createLdMCA,
  createLdMNA,
  createLdMNnA,
  createLdMNnSp,
  createLdMRA,
  createLdRN,
  createLdRR,
  createLdSpNn
} from "./ld";
import {
  ByteRegister,
  CpuRegisters,
  CpuRegistersImpl,
  GroupedWordRegister,
  Register
} from "./registers";
import { createRst, RstAddress } from "./rst";
import { createDecR } from "./dec";
import { createIncR, createIncRr, createIncSp } from "./inc";
import { createNop } from "./special";
import { createXorR } from "./xor";
import { numberToByteHex } from "../types";
import { createCb } from "./cb";
import { createJrNzN } from "./jr";
import { createSbcAR } from "./sbc";

export type ClockCycles = number;

export class Cpu {
  public readonly registers: CpuRegisters;
  // Temporary variable until refactor done
  private remainingCycles: ClockCycles;

  public constructor() {
    this.registers = new CpuRegistersImpl();
    this.remainingCycles = 0;
  }

  // TODO: See device comments for changes
  public tick(mmu: Mmu, cycles: ClockCycles): void {
    this.remainingCycles += cycles;

    // Note: that this currently goes below 0 which is a no no. Should only
    // simulate up to current available cycles
    while (this.remainingCycles > 4) {
      this.tickCycle(mmu);
    }
  }

  public tickCycle(mmu: Mmu): void {
    const opCode = mmu.readByte(this.registers.pc);
    this.remainingCycles -= 4;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const instruction = INSTRUCTIONS[opCode];
    if (!instruction) {
      throw new Error(
        `No instruction for opCode ${numberToByteHex(
          opCode
        )} reading from pc ${numberToByteHex(this.registers.pc)}`
      );
    }
    this.registers.pc++;

    this.remainingCycles -= instruction.execute(this, mmu);
  }
}

// LD A,(HL) 7E 8
// LD B,(HL) 46 8
// LD C,(HL) 4E 8
// LD D,(HL) 56 8
// LD E,(HL) 5E 8
// LD H,(HL) 66 8
// LD L,(HL) 6E 8

// LD (HL),n 36 12

// DEC (HL) 35 12

const INSTRUCTIONS: { [opCode: number]: Instruction } = fromPairs(
  [
    createNop(0x00),

    ...([
      [0x7f, "a", "a"],
      [0x78, "a", "b"],
      [0x79, "a", "c"],
      [0x7a, "a", "d"],
      [0x7b, "a", "e"],
      [0x7c, "a", "h"],
      [0x7d, "a", "l"],
      [0x40, "b", "b"],
      [0x41, "b", "c"],
      [0x42, "b", "d"],
      [0x43, "b", "e"],
      [0x44, "b", "h"],
      [0x45, "b", "l"],
      [0x48, "c", "b"],
      [0x49, "c", "c"],
      [0x4a, "c", "d"],
      [0x4b, "c", "e"],
      [0x4c, "c", "h"],
      [0x4d, "c", "l"],
      [0x50, "d", "b"],
      [0x51, "d", "c"],
      [0x52, "d", "d"],
      [0x53, "d", "e"],
      [0x54, "d", "h"],
      [0x55, "d", "l"],
      [0x58, "e", "b"],
      [0x59, "e", "c"],
      [0x5a, "e", "d"],
      [0x5b, "e", "e"],
      [0x5c, "e", "h"],
      [0x5d, "e", "l"],
      [0x60, "h", "b"],
      [0x61, "h", "c"],
      [0x62, "h", "d"],
      [0x63, "h", "e"],
      [0x64, "h", "h"],
      [0x65, "h", "l"],
      [0x68, "l", "b"],
      [0x69, "l", "c"],
      [0x6a, "l", "d"],
      [0x6b, "l", "e"],
      [0x6c, "l", "h"],
      [0x6d, "l", "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister, ByteRegister]>).map(
      ([opCode, register1, register2]) =>
        createLdRR(opCode, register1, register2)
    ),

    createLdMNnA(0xea),

    ...([
      [0x70, "b"],
      [0x71, "c"],
      [0x72, "d"],
      [0x73, "e"],
      [0x74, "h"],
      [0x75, "l"],
      [0x77, "a"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createLdHlMR(opCode, register)
    ),

    ...([[0x0a, "bc"], [0x1a, "de"], [0x7e, "hl"]] as ReadonlyArray<
      [OpCode, GroupedWordRegister]
    >).map(([opCode, register]) => createLdMRA(opCode, register)),

    createLdMNA(0xe0),

    ...([
      [0x06, "b"],
      [0x0e, "c"],
      [0x16, "d"],
      [0x1e, "e"],
      [0x26, "h"],
      [0x2e, "l"],
      [0x3e, "a"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createLdRN(opCode, register)
    ),

    ...([[0x01, "bc"], [0x11, "de"], [0x21, "hl"]] as ReadonlyArray<
      [OpCode, GroupedWordRegister]
    >).map(([opCode, register]) => createLdGrNn(opCode, register)),

    createLdSpNn(0x31),

    ...([
      [0xc7, 0x0000],
      [0xcf, 0x0008],
      [0xd7, 0x0010],
      [0xdf, 0x0018],
      [0xe7, 0x0020],
      [0xef, 0x0028],
      [0xf7, 0x0030],
      [0xff, 0x0038]
    ] as ReadonlyArray<[OpCode, RstAddress]>).map(([opCode, value]) =>
      createRst(opCode, value)
    ),

    createLdMNnSp(0x08),

    ...([
      [0x3d, "a"],
      [0x05, "b"],
      [0x0d, "c"],
      [0x15, "d"],
      [0x1d, "e"],
      [0x25, "h"],
      [0x2d, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createDecR(opCode, register)
    ),

    ...([[0x03, "bc"], [0x13, "de"], [0x23, "hl"]] as ReadonlyArray<
      [OpCode, GroupedWordRegister]
    >).map(([opCode, register]) => createIncRr(opCode, register)),

    createIncSp(0x33),

    ...([
      [0x3c, "a"],
      [0x04, "b"],
      [0x0c, "c"],
      [0x14, "d"],
      [0x1c, "e"],
      [0x24, "h"],
      [0x2c, "l"]
    ] as ReadonlyArray<[OpCode, Register]>).map(([opCode, register]) =>
      createIncR(opCode, register)
    ),

    ...([
      [0xaf, "a"],
      [0xa8, "b"],
      [0xa9, "c"],
      [0xaa, "d"],
      [0xab, "e"],
      [0xac, "h"],
      [0xad, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createXorR(opCode, register)
    ),

    createLddMHlA(0x32),

    createLdMCA(0xe2),

    createCb(0xcb),

    createJrNzN(0x20),

    ...([
      [0x9f, "a"],
      [0x98, "b"],
      [0x99, "c"],
      [0x9a, "d"],
      [0x9b, "e"],
      [0x9c, "h"],
      [0x9d, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createSbcAR(opCode, register)
    )
  ].map((i: Instruction) => [i.opCode, i])
);
