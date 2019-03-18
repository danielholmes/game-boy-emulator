/* global describe, test, expect */

import { Mmu } from "../../memory";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import { createCpuWithRegisters, createMmu } from "../../test/help";
import { createJrNzN } from "../jr";

describe("jr", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = createCpu();
    mmu = createMmu();
  });

  describe("createJrNzN", () => {
    test("JR NZ,n pass positive", () => {
      cpu.registers.pc = 0x0001;
      cpu.registers.f = 0x00;
      expect(cpu.registers.fNz).toBe(0); // Sanity check
      mmu.loadCartridge([0x00, 0x03]);

      const memorySnapshot = mmu.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0005, f: 0x00 }));
      expect(mmu).toEqual(memorySnapshot);
    });

    test("JR NZ,n pass negative", () => {
      cpu.registers.pc = 0x0004;
      cpu.registers.f = 0x00;
      expect(cpu.registers.fNz).toBe(0); // Sanity check
      mmu.loadCartridge([0x00, 0x00, 0x00, 0x00, 0xfd]); // -3

      const memorySnapshot = mmu.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0002, f: 0x00 }));
      expect(mmu).toEqual(memorySnapshot);
    });

    test("JR NZ,n skip", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.f = 0x80;
      expect(cpu.registers.fNz).toBe(1); // Sanity check
      mmu.loadCartridge([0x00, 0x03]);

      const memorySnapshot = mmu.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0001, f: 0x80 }));
      expect(mmu).toEqual(memorySnapshot);
    });
  });

  //   self.PC += 2
  //   if self.fNZ:
  //     self.PC += getSignedInt8(v)
  //     self.PC &= 0xFFFF
  //     return 0
  //   else:
  //     self.PC &= 0xFFFF
  //     return 1
});
