/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { createNop, di, ei } from "../special";
import { createCpuSnapshot, createMmu, EMPTY_MEMORY } from "../../test/help";
import { Cpu } from "..";

describe("special", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createNop", () => {
    test("success", () => {
      const instruction = createNop(0x00);

      const cpuSnapshot = createCpuSnapshot(cpu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });

  describe("ei", () => {
    test("success", () => {
      const instruction = ei(0x00);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu.ime).toBe(true);
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });

  describe("di", () => {
    test("success", () => {
      const instruction = di(0x00);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu.ime).toBe(false);
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });
});
