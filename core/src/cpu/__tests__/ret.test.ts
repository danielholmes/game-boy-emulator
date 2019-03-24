/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmuSnapshot, createMmu } from "../../test/help";
import { Cpu } from "..";
import { ret } from "../ret";

describe("ret", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("ret", () => {
    test("RET", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.sp = 0x8814;
      mmu.writeByte(0x8814, 0x32);
      mmu.writeByte(0x8815, 0x54);

      const instruction = ret(0x3d);

      const mmuSnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqualCpuWithRegisters({ sp: 0x8816, pc: 0x5432 });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });
});
