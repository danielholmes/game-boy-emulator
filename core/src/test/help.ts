import { Mmu } from "../memory/mmu";
import bios from "../bios";
import {
  IOMemory,
  OamMemory,
  VRam,
  WorkingRam,
  ZeroPageRam
} from "../memory/ram";
import { Cpu } from "../cpu";
import { ByteValue, MemoryAddress, WordValue } from "../types";

export const createMmu = (): Mmu =>
  new Mmu(
    bios,
    new WorkingRam(),
    new VRam(),
    new IOMemory(),
    new OamMemory(),
    new ZeroPageRam()
  );

export const EMPTY_MEMORY = createMmu();

export interface MmuSnapshot {
  readonly workingRamValues: Uint8Array;
}

export const createMmuSnapshot = (mmu: Mmu): MmuSnapshot => {
  return {
    workingRamValues: mmu.workingRamValues
  };
};

// TODO:
export const createCpuSnapshot = (cpu: Cpu): string => {
  return typeof cpu;
};

export const wordHighByte = (word: WordValue): ByteValue => word >> 8;

export const wordLowByte = (word: WordValue): ByteValue => word & 0xff;

export const writeWordBigEndian = (mmu: Mmu, address: MemoryAddress, value: WordValue): void => {
  mmu.writeByte(address + 1, value >> 8);
  mmu.writeByte(address, value & 255);
}
