import { CpuRegisters, Register } from "../cpu/registers";
import { toPairs } from "lodash";
import { ByteValue } from "../types";
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
import { Cartridge } from "../cartridge";

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

const isBitRegister = (name: string): name is 'fZ' | 'fC' | 'fN' | 'fH' | 'fNz' | 'fNc' =>
  ['fZ', 'fN', 'fH', 'fC', 'fNz', 'fNc'].indexOf(name) >= 0;

// Dummy to get around typing
const isRegister = (name: string): name is Register => !!name;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export const createCpuWithRegisters = (
  withRegisters: Partial<Omit<CpuRegisters, 'setFFromParts'>>
): Cpu => {
  const cpu = new Cpu();
  toPairs(withRegisters).forEach(([register, value]) => {
    if (value === undefined) {
      return;
    }
    if (isBitRegister(register)) {
      cpu.registers[register] = value ? 1 : 0;
    } else if (isRegister(register)) {
      cpu.registers[register] = value;
    }
  });
  return cpu;
};

export const createCpuRegistersWithRegisters = (
  withRegisters: Partial<CpuRegisters>
): CpuRegisters => {
  return createCpuWithRegisters(withRegisters).registers;
};

export const createMmuWithValues = (values: {
  [address: number]: ByteValue;
}): Mmu => {
  const mmu = createMmu();
  toPairs(values).forEach(([address, value]) =>
    mmu.writeByte(parseInt(address), value)
  );
  return mmu;
};

export const createMmuWithCartridgeAndValues = (
  cartridge: Cartridge,
  values?: { [address: number]: ByteValue }
): Mmu => {
  const mmu = createMmuWithValues(values || {});
  mmu.loadCartridge(cartridge);
  return mmu;
};

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
