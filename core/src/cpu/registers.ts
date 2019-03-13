import { ByteValue, WordValue } from '../types'

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
}

export type ByteRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l'
