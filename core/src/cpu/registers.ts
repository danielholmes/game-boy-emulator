import { BitValue, ByteValue, WordValue } from "../types";
import { flatMap } from "lodash";

// TODO: Should include all byte registers (inc f) or be renamed
export type ByteRegister = "a" | "b" | "c" | "d" | "e" | "h" | "l";

export const BYTE_REGISTERS: readonly ByteRegister[] = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "h",
  "l"
];

const BYTE_REGISTER_STRINGS: ReadonlySet<string> = new Set([
  "a",
  "b",
  "c",
  "d",
  "e",
  "h",
  "l"
]);

export const isByteRegister = (name: string): name is ByteRegister =>
  BYTE_REGISTER_STRINGS.has(name);

export type NonAfGroupedWordRegister = "bc" | "de" | "hl";

export type GroupedWordRegister = "af" | NonAfGroupedWordRegister;

type NativeWordRegister = "sp" | "pc";

export type WordRegister = GroupedWordRegister | NativeWordRegister;

const WORD_REGISTER_STRINGS: ReadonlySet<string> = new Set([
  "af",
  "bc",
  "de",
  "hl",
  "sp",
  "pc"
]);

export const isWordRegister = (name: string): name is WordRegister =>
  WORD_REGISTER_STRINGS.has(name);

export type Register = ByteRegister | "f" | WordRegister;

export const NON_AF_GROUPED_WORD_REGISTERS: readonly NonAfGroupedWordRegister[] = [
  "bc",
  "de",
  "hl"
];

export const GROUPED_WORD_REGISTERS: readonly GroupedWordRegister[] = [
  "af",
  ...NON_AF_GROUPED_WORD_REGISTERS
];

export const NON_A_BYTE_REGISTERS: readonly ByteRegister[] = BYTE_REGISTERS.filter(
  r => r !== "a"
);

export const BYTE_REGISTER_PAIR_PERMUTATIONS: readonly Readonly<
  [ByteRegister, ByteRegister]
>[] = flatMap(
  BYTE_REGISTERS.map(r1 =>
    BYTE_REGISTERS.map(r2 => [r1, r2] as Readonly<[ByteRegister, ByteRegister]>)
  )
);

// TODO: Shouldn't be exported, find a way to encapsulate this
export const FLAG_Z_BIT = 7;
const FLAG_N_BIT = 6;
const FLAG_H_BIT = 5;
const FLAG_C_BIT = 4;
export const FLAG_Z_MASK = 1 << FLAG_Z_BIT;
export const FLAG_N_MASK = 1 << FLAG_N_BIT;
export const FLAG_H_MASK = 1 << FLAG_H_BIT;
export const FLAG_C_MASK = 1 << FLAG_C_BIT;

type BitIndicator = BitValue | boolean;

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
  af: WordValue;

  fZ: BitValue;
  fNz: BitValue;
  fN: BitValue;
  fH: BitValue;
  fC: BitValue;
  fNc: BitValue;

  setFFromParts(
    z: BitIndicator,
    n: BitIndicator,
    h: BitIndicator,
    c: BitIndicator
  ): void;

  setFHFromByteAdd(original: ByteValue, add: ByteValue): void;
  setFHFromWordAdd(original: WordValue, add: WordValue): void;

  setFHFromByteSubtract(original: ByteValue, subtract: ByteValue): void;
  setFHFromWordSubtract(original: WordValue, subtract: WordValue): void;
}

export const calculateFHFromByteAdd = (
  original: ByteValue,
  add: ByteValue
): BitValue => ((((original & 0xf) + (add & 0xf)) & 0x10) === 0x10 ? 1 : 0);

export class CpuRegistersImpl implements CpuRegisters {
  // Idea, if store all these in uint8array instead then will do & 0xff
  // "for free". Do some performance checks on it
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

  public setFFromParts(
    z: BitIndicator,
    n: BitIndicator,
    h: BitIndicator,
    c: BitIndicator
  ): void {
    this._f =
      (z ? FLAG_Z_MASK : 0) +
      (n ? FLAG_N_MASK : 0) +
      (h ? FLAG_H_MASK : 0) +
      (c ? FLAG_C_MASK : 0);
  }

  public setFHFromByteAdd(original: ByteValue, add: ByteValue): void {
    this.fH = calculateFHFromByteAdd(original, add);
  }

  public setFHFromWordAdd(original: ByteValue, add: ByteValue): void {
    this.fH = (((original & 0xff) + (add & 0xff)) & 0x100) === 0x100 ? 1 : 0;
  }

  public setFHFromByteSubtract(original: ByteValue, subtract: ByteValue): void {
    if (subtract !== 1) {
      throw new Error("Not impl");
    }
    this.fH = (original & 0xf) === 0 ? 1 : 0;
  }

  public setFHFromWordSubtract(original: ByteValue, subtract: ByteValue): void {
    if (subtract !== 1) {
      throw new Error("Not impl");
    }
    this.fH = (original & 0xff) === 0 ? 1 : 0;
  }

  public get fNz(): BitValue {
    return this.fZ ? 0 : 1;
  }
  public set fNz(value: BitValue) {
    this.fZ = value ? 0 : 1;
  }

  public get fZ(): BitValue {
    return (this.f & FLAG_Z_MASK) !== 0 ? 1 : 0;
  }
  public set fZ(value: BitValue) {
    if (value === 1) {
      this.f |= FLAG_Z_MASK;
      return;
    }
    this.f &= ~FLAG_Z_MASK;
  }

  public get fN(): BitValue {
    return (this.f & FLAG_N_MASK) !== 0 ? 1 : 0;
  }
  public set fN(value: BitValue) {
    if (value === 1) {
      this.f |= FLAG_N_MASK;
      return;
    }
    this.f &= ~FLAG_N_MASK;
  }

  public get fH(): BitValue {
    return (this.f & FLAG_H_MASK) !== 0 ? 1 : 0;
  }
  public set fH(value: BitValue) {
    if (value === 1) {
      this.f |= FLAG_H_MASK;
      return;
    }
    this.f &= ~FLAG_H_MASK;
  }

  public get fC(): BitValue {
    return (this.f & FLAG_C_MASK) !== 0 ? 1 : 0;
  }
  public set fC(value: BitValue) {
    if (value === 1) {
      this.f |= FLAG_C_MASK;
      return;
    }
    this.f &= ~FLAG_C_MASK;
  }

  public get fNc(): BitValue {
    return this.fC ? 0 : 1;
  }
  public set fNc(value: BitValue) {
    this.fC = value ? 0 : 1;
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

  public set af(value: ByteValue) {
    this._a = (value >> 8) & 0xff;
    this._f = value & 0xff;
  }
  public get af(): ByteValue {
    return (this._a << 8) + this._f;
  }

  public set hl(value: ByteValue) {
    this._h = (value >> 8) & 0xff;
    this._l = value & 0xff;
  }
  public get hl(): ByteValue {
    return (this._h << 8) + this._l;
  }
}
