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
