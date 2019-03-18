import { CpuRegisters, Register } from "../cpu/registers";
import { Cpu } from "../cpu/types";
import { create as createCpu } from "../cpu";
import { Mmu } from "../memory";
import { toPairs } from "lodash";
import { ByteValue } from "../types";
import { Ram } from "../memory/ram";

export const createMmu = (): Mmu =>
  new Mmu(new Ram(0x2000), new Ram(0x2000), new Ram(0xff));

export const EMPTY_MEMORY = createMmu();

// Dummy to get around typing
const isRegister = (name: string): name is Register => !!name;

export const createCpuWithRegisters = (
  withRegisters: Partial<CpuRegisters>
): Cpu => {
  const cpu = createCpu();
  toPairs(withRegisters).forEach(([register, value]) => {
    if (isRegister(register) && typeof value !== "undefined") {
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

export const createMmuWithRomAndValues = (
  rom: ReadonlyArray<ByteValue>,
  values?: { [address: number]: ByteValue }
): Mmu => {
  const mmu = createMmuWithValues(values || {});
  mmu.loadCartridge(rom);
  return mmu;
};
