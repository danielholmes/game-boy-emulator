import { Instruction, OpCode } from "./instructions";
import { createNop } from "./special";
import {
  ByteRegister,
  GroupedWordRegister,
  NonAfGroupedWordRegister
} from "./registers";
import {
  createLdAMFfC,
  ldAMFfN,
  createLddMHlA,
  ldHlMR,
  ldiMHlA,
  ldMFfCA,
  ldMFfNA,
  ldMNnA,
  ldMNnSp,
  ldMRA,
  createLdRMRr,
  ldRN,
  createLdRR,
  ldRrNn
} from "./ld";
import { createCallFNn, createCallNn } from "./call";
import { CheckFlag } from "./lowLevel";
import { push } from "./push";
import { createRst, RstAddress } from "./rst";
import { createRlR } from "./rl";
import { createPopRr } from "./pop";
import { createDecR, createDecRr, DecRrRegister } from "./dec";
import { createIncR, createIncRr } from "./inc";
import { createXorR } from "./xor";
import { createAdcN } from "./add";
import { subMHl, subN, subR } from "./sub";
import { createCpMHl, createCpN, createCpR } from "./cp";
import { createCb } from "./cb";
import { ret } from "./ret";
import { createJrCcN, createJrN } from "./jr";
import { sbcAR } from "./sbc";
import { fromPairs } from "lodash";

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
      [0x47, "b", "a"],
      [0x40, "b", "b"],
      [0x41, "b", "c"],
      [0x42, "b", "d"],
      [0x43, "b", "e"],
      [0x44, "b", "h"],
      [0x45, "b", "l"],
      [0x4f, "c", "a"],
      [0x48, "c", "b"],
      [0x49, "c", "c"],
      [0x4a, "c", "d"],
      [0x4b, "c", "e"],
      [0x4c, "c", "h"],
      [0x4d, "c", "l"],
      [0x57, "d", "a"],
      [0x50, "d", "b"],
      [0x51, "d", "c"],
      [0x52, "d", "d"],
      [0x53, "d", "e"],
      [0x54, "d", "h"],
      [0x55, "d", "l"],
      [0x5f, "e", "a"],
      [0x58, "e", "b"],
      [0x59, "e", "c"],
      [0x5a, "e", "d"],
      [0x5b, "e", "e"],
      [0x5c, "e", "h"],
      [0x5d, "e", "l"],
      [0x67, "h", "a"],
      [0x60, "h", "b"],
      [0x61, "h", "c"],
      [0x62, "h", "d"],
      [0x63, "h", "e"],
      [0x64, "h", "h"],
      [0x65, "h", "l"],
      [0x6f, "l", "a"],
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

    ldMNnA(0xea),

    createCallNn(0xcd),
    ...([
      [0xc4, "fNz"],
      [0xcc, "fZ"],
      [0xd4, "fNc"],
      [0xdc, "fC"]
    ] as ReadonlyArray<[OpCode, CheckFlag]>).map(([opCode, flag]) =>
      createCallFNn(opCode, flag)
    ),

    ...([
      [0xf5, "af"],
      [0xc5, "bc"],
      [0xd5, "de"],
      [0xe5, "hl"]
    ] as ReadonlyArray<[OpCode, GroupedWordRegister]>).map(
      ([opCode, register]) => push(opCode, register)
    ),

    ...([
      [0x70, "b"],
      [0x71, "c"],
      [0x72, "d"],
      [0x73, "e"],
      [0x74, "h"],
      [0x75, "l"],
      [0x77, "a"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      ldHlMR(opCode, register)
    ),

    ...([
      [0x7e, "a", "hl"],
      [0x46, "b", "hl"],
      [0x4e, "c", "hl"],
      [0x56, "d", "hl"],
      [0x5e, "e", "hl"],
      [0x66, "h", "hl"],
      [0x6e, "l", "hl"],
      [0x0a, "a", "bc"],
      [0x1a, "a", "de"]
    ] as ReadonlyArray<[OpCode, ByteRegister, NonAfGroupedWordRegister]>).map(
      ([opCode, register1, register2]) =>
        createLdRMRr(opCode, register1, register2)
    ),

    ...([[0x02, "bc"], [0x12, "de"], [0x77, "hl"]] as ReadonlyArray<
      [OpCode, NonAfGroupedWordRegister]
    >).map(([opCode, register]) => ldMRA(opCode, register)),

    ldMFfNA(0xe0),

    ...([
      [0x06, "b"],
      [0x0e, "c"],
      [0x16, "d"],
      [0x1e, "e"],
      [0x26, "h"],
      [0x2e, "l"],
      [0x3e, "a"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      ldRN(opCode, register)
    ),

    ...([
      [0x01, "bc"],
      [0x11, "de"],
      [0x21, "hl"],
      [0x31, "sp"]
    ] as ReadonlyArray<[OpCode, NonAfGroupedWordRegister | "sp"]>).map(
      ([opCode, register]) => ldRrNn(opCode, register)
    ),

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

    createRlR(0x17, "a"),

    ldMNnSp(0x08),

    ...([
      [0xf1, "af"],
      [0xc1, "bc"],
      [0xd1, "de"],
      [0xe1, "hl"]
    ] as ReadonlyArray<[OpCode, GroupedWordRegister]>).map(
      ([opCode, register]) => createPopRr(opCode, register)
    ),

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

    ...([
      [0x0b, "bc"],
      [0x1b, "de"],
      [0x2b, "hl"],
      [0x3b, "sp"]
    ] as ReadonlyArray<[OpCode, DecRrRegister]>).map(([opCode, register]) =>
      createDecRr(opCode, register)
    ),

    ...([
      [0x03, "bc"],
      [0x13, "de"],
      [0x23, "hl"],
      [0x33, "sp"]
    ] as ReadonlyArray<[OpCode, NonAfGroupedWordRegister]>).map(
      ([opCode, register]) => createIncRr(opCode, register)
    ),

    ...([
      [0x3c, "a"],
      [0x04, "b"],
      [0x0c, "c"],
      [0x14, "d"],
      [0x1c, "e"],
      [0x24, "h"],
      [0x2c, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
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

    createAdcN(0xce),

    ...([
      [0x97, "a"],
      [0x90, "b"],
      [0x91, "c"],
      [0x92, "d"],
      [0x93, "e"],
      [0x94, "h"],
      [0x95, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      subR(opCode, register)
    ),
    subMHl(0x96),
    subN(0xd6),

    ...([
      [0xbf, "a"],
      [0xb8, "b"],
      [0xb9, "c"],
      [0xba, "d"],
      [0xbb, "e"],
      [0xbc, "h"],
      [0xbd, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      createCpR(opCode, register)
    ),
    createCpMHl(0xbe),
    createCpN(0xfe),

    createLddMHlA(0x32),
    ldiMHlA(0x22),

    ldMFfCA(0xe2),
    ldAMFfN(0xf0),
    createLdAMFfC(0xf2),

    createCb(0xcb),

    ret(0xc9),

    ...([
      [0x20, "fNz"],
      [0x28, "fZ"],
      [0x30, "fNc"],
      [0x38, "fC"]
    ] as ReadonlyArray<[OpCode, CheckFlag]>).map(([opCode, flag]) =>
      createJrCcN(opCode, flag)
    ),
    createJrN(0x18),

    ...([
      [0x9f, "a"],
      [0x98, "b"],
      [0x99, "c"],
      [0x9a, "d"],
      [0x9b, "e"],
      [0x9c, "h"],
      [0x9d, "l"]
    ] as ReadonlyArray<[OpCode, ByteRegister]>).map(([opCode, register]) =>
      sbcAR(opCode, register)
    )
  ].map((i: Instruction) => [i.opCode, i])
);

export default INSTRUCTIONS;
