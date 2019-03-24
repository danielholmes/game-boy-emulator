/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuSnapshot, EMPTY_MEMORY } from "../../test/help";
import { Cpu } from "..";
import { createAdcN } from "../add";
import { Cartridge } from "../../cartridge";

describe("add", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createAdcN", () => {
    test("ADC a,n basic", () => {
      cpu.registers.a = 0x12;
      cpu.registers.fC = 0;
      cpu.registers.pc = 0x0000;
      const cart = new Cartridge(new Uint8Array([0x34]));
      mmu.loadCartridge(cart);

      const instruction = createAdcN(0x3d);
      const mmuSnapshot = createMmuSnapshot(mmu);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x46,
        fZ: 0,
        fN: 0,
        fH: 0,
        fC: 0,
        pc: 0x0001
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });

    test("ADC a,n use carry", () => {
      cpu.registers.a = 0x27;
      cpu.registers.fC = 1;
      cpu.registers.pc = 0x0000;
      const cart = new Cartridge(new Uint8Array([0x00]));
      mmu.loadCartridge(cart);

      const instruction = createAdcN(0x3d);
      const mmuSnapshot = createMmuSnapshot(mmu);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x28,
        fZ: 0,
        fN: 0,
        fH: 0,
        fC: 0,
        pc: 0x0001
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });

    test("ADC a,n zero", () => {
      cpu.registers.a = 0xfe;
      cpu.registers.fC = 1;
      cpu.registers.pc = 0x0000;
      const cart = new Cartridge(new Uint8Array([0x01]));
      mmu.loadCartridge(cart);

      const instruction = createAdcN(0x3d);
      const mmuSnapshot = createMmuSnapshot(mmu);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x00,
        fZ: 1,
        fN: 0,
        fH: 1,
        fC: 1,
        pc: 0x0001
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });

    test("ADC a,n half carry", () => {
      cpu.registers.a = 0x0e;
      cpu.registers.fC = 0;
      cpu.registers.pc = 0x0000;
      const cart = new Cartridge(new Uint8Array([0x05]));
      mmu.loadCartridge(cart);

      const instruction = createAdcN(0x3d);
      const mmuSnapshot = createMmuSnapshot(mmu);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x13,
        fZ: 0,
        fN: 0,
        fH: 1,
        fC: 0,
        pc: 0x0001
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });
});
