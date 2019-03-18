/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { createNop } from "../special";
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

      expect(cycles).toBe(4);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });
});
