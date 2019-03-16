import { ByteValue, WordValue } from '../types'
import { flatMap } from 'lodash'

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

export const BYTE_REGISTERS: ReadonlyArray<ByteRegister> = ['a', 'b', 'c', 'd', 'e', 'h', 'l']

export const BYTE_REGISTER_PAIR_PERMUTATIONS: ReadonlyArray<Readonly<[ByteRegister, ByteRegister]>> =
  flatMap(
    BYTE_REGISTERS.map((r1) =>
      BYTE_REGISTERS.map((r2) => [r1, r2] as Readonly<[ByteRegister, ByteRegister]>)
    )
  )
