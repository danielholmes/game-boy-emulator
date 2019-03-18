import { Memory } from "../memory";
import { fromPairs } from "lodash";
import { Cpu } from "./types";
import { Instruction, OpCode } from "./instructions";
import {
  createLddMHlA,
  createLdGrNn,
  createLdMNnSp,
  createLdRN,
  createLdRR,
  createLdSpNn
} from "./ld";
import {
  ByteRegister,
  CpuRegistersImpl,
  GroupedWordRegister
} from "./registers";
import { createRst, RstAddress } from "./rst";
import { createDecR } from "./dec";
import { createIncRr, createIncSp } from "./inc";
import { createNop } from "./special";
import { createXorR } from "./xor";
import { numberToByteHex } from "../types";
import { createCb } from "./cb";
import { createJrNzN } from "./jr";
import { createSbcAR } from "./sbc";

export const create = (): Cpu => ({
  registers: new CpuRegistersImpl()
});

export const copyCpu = (cpu: Cpu): Cpu => ({ ...cpu });

export const runInstruction = (cpu: Cpu, memory: Memory): void => {
  const opCode = memory.readByte(cpu.registers.pc);
  const instruction = INSTRUCTIONS[opCode];
  if (!instruction) {
    throw new Error(`No instruction for opCode ${numberToByteHex(opCode)}`);
  }
  cpu.registers.pc++;

  instruction.execute(cpu, memory);
};

// LD A,(HL) 7E 8
// LD B,(HL) 46 8
// LD C,(HL) 4E 8
// LD D,(HL) 56 8
// LD E,(HL) 5E 8
// LD H,(HL) 66 8
// LD L,(HL) 6E 8

// LD (HL),B 70 8
// LD (HL),C 71 8
// LD (HL),D 72 8
// LD (HL),E 73 8
// LD (HL),H 74 8
// LD (HL),L 75 8
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

// const nop = (): void => {}
//
// // Internal
// const rsv = (cpu: Cpu): void => {
//   /*Z80._rsv.a = Z80._r.a; Z80._rsv.b = Z80._r.b;
//   Z80._rsv.c = Z80._r.c; Z80._rsv.d = Z80._r.d;
//   Z80._rsv.e = Z80._r.e; Z80._rsv.f = Z80._r.f;
//   Z80._rsv.h = Z80._r.h; Z80._rsv.l = Z80._r.l;*/
// }
//
// const rst = (cpu: Cpu, memory: Memory): void => {
//   rsv(cpu)
//   cpu.registers.sp -= 2
//   memory.writeWord(cpu.registers.sp, cpu.registers.pc)
//   cpu.registers.pc = 0x38
// }
//
// type Cycles = number
//
// interface NoOperandInstruction {
//   readonly execute: (cpu: Cpu, memory: Memory) => void
//   readonly operandLength: 0
//   readonly cycles: Cycles
// }
//
// interface ByteOperandInstruction {
//   readonly execute: (cpu: Cpu, memory: Memory, value: ByteValue) => void
//   readonly operandLength: 1
//   readonly cycles: Cycles
// }
//
// interface WordOperandInstruction {
//   readonly execute: (cpu: Cpu, memory: Memory, value: WordValue) => void
//   readonly operandLength: 2
//   readonly cycles: Cycles
// }
//
// type Instruction = NoOperandInstruction | ByteOperandInstruction | WordOperandInstruction
//
// // NOTE:!! Word operands should maybe take 2 bytes/operands
// // See how cinoop deals with it. If all single operands then maybe it's operandSize we're dealing with
// const INSTRUCTIONS: { [opCode: number]: Instruction } = mapValues(
//   {
//     0x06: [partial(ldNnN, 'b'), 1, 8],
//     0x0E: [partial(ldNnN, 'c'), 1, 8],
//     0x16: [partial(ldNnN, 'd'), 1, 8],
//     0x1E: [partial(ldNnN, 'e'), 1, 8],
//     0x26: [partial(ldNnN, 'h'), 1, 8],
//     0x2E: [partial(ldNnN, 'l'), 1, 8],
//
//     0x7F: [partial(ldR1R2, 'a', 'a'), 0, 4],
//     0x78: [partial(ldR1R2, 'a', 'b'), 0, 4],
//     0x79: [partial(ldR1R2, 'a', 'c'), 0, 4],
//     0x7A: [partial(ldR1R2, 'a', 'd'), 0, 4],
//     0x7B: [partial(ldR1R2, 'a', 'e'), 0, 4],
//     0x7C: [partial(ldR1R2, 'a', 'h'), 0, 4],
//     0x7D: [partial(ldR1R2, 'a', 'l'), 0, 4],
//     0x7E: [partial(ldR1R2Word, 'a', 'hl'), 0, 8],
//     0x40: [partial(ldR1R2, 'b', 'b'), 0, 4],
//     0x41: [partial(ldR1R2, 'b', 'c'), 0, 4],
//     0x42: [partial(ldR1R2, 'b', 'd'), 0, 4],
//     0x43: [partial(ldR1R2, 'b', 'e'), 0, 4],
//     0x44: [partial(ldR1R2, 'b', 'h'), 0, 4],
//     0x45: [partial(ldR1R2, 'b', 'l'), 0, 4],
//     0x46: [partial(ldR1R2Word, 'b', 'hl'), 0, 8],
//     0x48: [partial(ldR1R2, 'c', 'b'), 0, 4],
//     0x49: [partial(ldR1R2, 'c', 'c'), 0, 4],
//     0x4A: [partial(ldR1R2, 'c', 'd'), 0, 4],
//     0x4B: [partial(ldR1R2, 'c', 'e'), 0, 4],
//     0x4C: [partial(ldR1R2, 'c', 'h'), 0, 4],
//     0x4D: [partial(ldR1R2, 'c', 'l'), 0, 4],
//     0x4E: [partial(ldR1R2Word, 'c', 'hl'), 0, 8],
//     0x50: [partial(ldR1R2, 'd', 'b'), 0, 4],
//     0x51: [partial(ldR1R2, 'd', 'c'), 0, 4],
//     0x52: [partial(ldR1R2, 'd', 'd'), 0, 4],
//     0x53: [partial(ldR1R2, 'd', 'e'), 0, 4],
//     0x54: [partial(ldR1R2, 'd', 'h'), 0, 4],
//     0x55: [partial(ldR1R2, 'd', 'l'), 0, 4],
//     0x56: [partial(ldR1R2Word, 'd', 'hl'), 0, 8],
//     0x58: [partial(ldR1R2, 'e', 'b'), 0, 4],
//     0x59: [partial(ldR1R2, 'e', 'c'), 0, 4],
//     0x5A: [partial(ldR1R2, 'e', 'd'), 0, 4],
//     0x5B: [partial(ldR1R2, 'e', 'e'), 0, 4],
//     0x5C: [partial(ldR1R2, 'e', 'h'), 0, 4],
//     0x5D: [partial(ldR1R2, 'e', 'l'), 0, 4],
//     0x5E: [partial(ldR1R2Word, 'e', 'hl'), 0, 8],
//     0x60: [partial(ldR1R2, 'h', 'b'), 0, 4],
//     0x61: [partial(ldR1R2, 'h', 'c'), 0, 4],
//     0x62: [partial(ldR1R2, 'h', 'd'), 0, 4],
//     0x63: [partial(ldR1R2, 'h', 'e'), 0, 4],
//     0x64: [partial(ldR1R2, 'h', 'h'), 0, 4],
//     0x65: [partial(ldR1R2, 'h', 'l'), 0, 4],
//     0x66: [partial(ldR1R2Word, 'h', 'hl'), 0, 8],
//     0x68: [partial(ldR1R2, 'l', 'b'), 0, 4],
//     0x69: [partial(ldR1R2, 'l', 'c'), 0, 4],
//     0x6A: [partial(ldR1R2, 'l', 'd'), 0, 4],
//     0x6B: [partial(ldR1R2, 'l', 'e'), 0, 4],
//     0x6C: [partial(ldR1R2, 'l', 'h'), 0, 4],
//     0x6D: [partial(ldR1R2, 'l', 'l'), 0, 4],
//     0x6E: [partial(ldR1R2Word, 'l', 'hl'), 0, 8],
//     0x70: [partial(ldR1WordR2, 'hl', 'b'), 0, 8],
//     0x71: [partial(ldR1WordR2, 'hl', 'c'), 0, 8],
//     0x72: [partial(ldR1WordR2, 'hl', 'd'), 0, 8],
//     0x73: [partial(ldR1WordR2, 'hl', 'e'), 0, 8],
//     0x74: [partial(ldR1WordR2, 'hl', 'h'), 0, 8],
//     0x75: [partial(ldR1WordR2, 'hl', 'l'), 0, 8],
//     // TODO
//     // 0x36: [partial(ldR1R2, 'hl', 'n'), 0, 12]
//
//     0x0A: [partial(ldR1R2Word, 'a', 'bc'), 0, 8],
//     0x1A: [partial(ldR1R2Word, 'a', 'de'), 0, 8],
//     0x3E: [partial(ldNnN, 'a'), 1, 8],
//     0xFA: [partial(ldNnNWord, 'a'), 1, 16],
//
//     0x47: [partial(ldR1R2, 'b', 'a'), 0, 4],
//     0x4F: [partial(ldR1R2, 'c', 'a'), 0, 4],
//     0x57: [partial(ldR1R2, 'd', 'a'), 0, 4],
//     0x5F: [partial(ldR1R2, 'e', 'a'), 0, 4],
//     0x67: [partial(ldR1R2, 'h', 'a'), 0, 4],
//     0x6F: [partial(ldR1R2, 'l', 'a'), 0, 4],
//     0x02: [partial(ldR1WordR2, 'bc', 'a'), 0, 8],
//     0x12: [partial(ldR1WordR2, 'de', 'a'), 0, 8],
//     0x77: [partial(ldR1WordR2, 'hl', 'a'), 0, 8],
//     0xEA: [partial(ldNnNWord, 'a'), 1, 16],
//
//     0xF2: [partial(ldMemAddN, 'c'), 1, 8],
//
//     0xE2: [partial(ldRMemAddN, 'c'), 1, 8],
//
//     0x3A: [ldDAHl, 0, 8],
//     // Not sure what these are
//     /* LD A,(HLD) 3A 8
//      LD A,(HL-) 3A 8
//      LDD A,(HL) 3A 8 */
//
//     // Up to page 72
//
//     // Started again at page 76
//     0x01: [partial(ldWordNnN, 'bc'), 1, 12],
//     0x11: [partial(ldWordNnN, 'de'), 1, 12],
//     0x21: [partial(ldWordNnN, 'hl'), 1, 12],
//     0x31: [partial(ldWordNnN, 'sp'), 1, 12],
//
//     // Put A into memory address HL. Increment HL.
//     0x22: [ldIHl, 0, 8],
//
//     0x03: [partial(incWord, 'bc'), 0, 8],
//     0x13: [partial(incWord, 'de'), 0, 8],
//     0x23: [partial(incWord, 'hl'), 0, 8],
//     0x33: [partial(incWord, 'sp'), 0, 8],
//
//     0x00: [nop, 0, 4],
//
//     0xFF: [partial(rst), 1, 32]
//   } as {
//     [opCode: number]: [(cpu: Cpu, memory: Memory) => void, 0, Cycles] |
//       [(cpu: Cpu, memory: Memory, value: ByteValue) => void, 1, Cycles] |
//       [(cpu: Cpu, memory: Memory, value: WordValue) => void, 2, Cycles]
//   },
//   ([execute, operandLength, cycles]): Instruction => {
//     switch (operandLength) {
//       case 0:
//         return { execute: execute as (cpu: Cpu, memory: Memory) => void, operandLength, cycles }
//       case 1:
//         return { execute, operandLength, cycles }
//       case 2:
//         return { execute, operandLength, cycles }
//     }
//   }
// )
