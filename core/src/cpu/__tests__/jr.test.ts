/* global describe, test, expect */

import {
  createCpuWithRegisters,
  createMemorySnapshot,
  createMmu
} from "../../test/help";
import { createJrNzN } from "../jr";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { Cartridge } from "../../cartridge";
import { binaryToNumber } from "../../types";

describe("jr", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createJrNzN", () => {
    test("JR NZ,n pass positive", () => {
      cpu.registers.pc = 0x0001;
      cpu.registers.f = binaryToNumber("00000000");
      expect(cpu.registers.fNz).toBe(1); // Sanity check
      mmu.loadCartridge(new Cartridge(new Uint8Array([0x00, 0x03])));

      const memorySnapshot = createMemorySnapshot(mmu);
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0005, f: 0x00 }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });

    test("JR NZ,n pass negative", () => {
      cpu.registers.pc = 0x0004;
      cpu.registers.f = binaryToNumber("00000000");
      expect(cpu.registers.fNz).toBe(1); // Sanity check
      const cartridge = new Cartridge(
        new Uint8Array([0x00, 0x00, 0x00, 0x00, 0xfd])
      );
      mmu.loadCartridge(cartridge); // -3

      const memorySnapshot = createMemorySnapshot(mmu);
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0002, f: 0x00 }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });

    test("JR NZ,n skip", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.f = binaryToNumber("10000000");
      expect(cpu.registers.fNz).toBe(0); // Sanity check
      const cartridge = new Cartridge(new Uint8Array([0x00, 0x03]));
      mmu.loadCartridge(cartridge);

      const memorySnapshot = createMemorySnapshot(mmu);
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0001, f: 0x80 }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });
});
