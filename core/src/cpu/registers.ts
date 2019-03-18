import { BitValue, ByteValue, WordValue } from "../types";
import { flatMap } from "lodash";

export type ByteRegister = "a" | "b" | "c" | "d" | "e" | "h" | "l";

export type GroupedWordRegister = "bc" | "de" | "hl";

export type Register = ByteRegister | "f" | GroupedWordRegister | "sp" | "pc";

export const GROUPED_WORD_REGISTERS: ReadonlyArray<GroupedWordRegister> = [
  "bc",
  "de",
  "hl"
];

export const BYTE_REGISTERS: ReadonlyArray<ByteRegister> = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "h",
  "l"
];

export const BYTE_REGISTER_PAIR_PERMUTATIONS: ReadonlyArray<
  Readonly<[ByteRegister, ByteRegister]>
> = flatMap(
  BYTE_REGISTERS.map(r1 =>
    BYTE_REGISTERS.map(r2 => [r1, r2] as Readonly<[ByteRegister, ByteRegister]>)
  )
);

/*const B_C_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['b', 'c']
const D_E_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['d', 'e']
const H_L_REGISTERS: Readonly<[ByteRegister, ByteRegister]> = ['h', 'l']

export const groupedWordByteRegisters = (register: GroupedWordRegister): Readonly<[ByteRegister, ByteRegister]> => {
  switch (register)
  {
    case 'bc':
      return B_C_REGISTERS
    case 'de':
      return D_E_REGISTERS
    case 'hl':
      return H_L_REGISTERS
  }
}*/

// TODO: Shouldn't be exported, find a way to encapsulate this
export const FLAG_Z = 7;
export const FLAG_Z_MASK = 1 << 7;

export interface CpuRegisters {
  a: ByteValue;
  b: ByteValue;
  c: ByteValue;
  d: ByteValue;
  e: ByteValue;
  h: ByteValue;
  l: ByteValue;

  f: ByteValue;

  pc: WordValue;
  sp: WordValue;

  bc: WordValue;
  de: WordValue;
  hl: WordValue;

  readonly fNz: BitValue;
}

export class CpuRegistersImpl implements CpuRegisters {
  private _a: ByteValue;
  private _b: ByteValue;
  private _c: ByteValue;
  private _d: ByteValue;
  private _e: ByteValue;
  private _h: ByteValue;
  private _l: ByteValue;

  private _f: ByteValue;

  private _pc: WordValue;
  private _sp: WordValue;

  public constructor() {
    this._a = 0x00;
    this._b = 0x00;
    this._c = 0x00;
    this._d = 0x00;
    this._e = 0x00;
    this._h = 0x00;
    this._l = 0x00;

    this._f = 0x0000;

    this._pc = 0x0000;
    this._sp = 0xffff;
  }

  public get fNz(): BitValue {
    return (this.f & FLAG_Z_MASK) !== 0 ? 1 : 0;
  }

  public set a(value: ByteValue) {
    this._a = value & 0xff; // Mask to 8 bits
  }
  public get a(): ByteValue {
    return this._a;
  }

  public set b(value: ByteValue) {
    this._b = value & 0xff; // Mask to 8 bits
  }
  public get b(): ByteValue {
    return this._b;
  }

  public set c(value: ByteValue) {
    this._c = value & 0xff; // Mask to 8 bits
  }
  public get c(): ByteValue {
    return this._c;
  }

  public set d(value: ByteValue) {
    this._d = value & 0xff; // Mask to 8 bits
  }
  public get d(): ByteValue {
    return this._d;
  }

  public set e(value: ByteValue) {
    this._e = value & 0xff; // Mask to 8 bits
  }
  public get e(): ByteValue {
    return this._e;
  }

  public set h(value: ByteValue) {
    this._h = value & 0xff; // Mask to 8 bits
  }
  public get h(): ByteValue {
    return this._h;
  }

  public set l(value: ByteValue) {
    this._l = value & 0xff; // Mask to 8 bits
  }
  public get l(): ByteValue {
    return this._l;
  }

  public set f(value: ByteValue) {
    this._f = value & 0xff; // Mask to 8 bits
  }
  public get f(): ByteValue {
    return this._f;
  }

  public set pc(value: ByteValue) {
    this._pc = value & 0xffff; // Mask to 16 bits
  }
  public get pc(): ByteValue {
    return this._pc;
  }

  public set sp(value: ByteValue) {
    this._sp = value & 0xffff; // Mask to 16 bits
  }
  public get sp(): ByteValue {
    return this._sp;
  }

  public set bc(value: ByteValue) {
    this._b = (value >> 8) & 0xff;
    this._c = value & 0xff;
  }
  public get bc(): ByteValue {
    return (this._b << 8) + this._c;
  }

  public set de(value: ByteValue) {
    this._d = (value >> 8) & 0xff;
    this._e = value & 0xff;
  }
  public get de(): ByteValue {
    return (this._d << 8) + this._e;
  }

  public set hl(value: ByteValue) {
    this._h = (value >> 8) & 0xff;
    this._l = value & 0xff;
  }
  public get hl(): ByteValue {
    return (this._h << 8) + this._l;
  }
}
