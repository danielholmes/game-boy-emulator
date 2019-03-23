/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmuSnapshot, createMmu } from "../../test/help";
import { Cpu } from "..";
import { createRet } from "../ret";

describe("ret", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createRet", () => {
    test("RET", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.sp = 0x8814;
      mmu.writeWordBigEndian(0x8814, 0x5432);

      const instruction = createRet(0x3d);

      const mmuSnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqualCpuWithRegisters({ sp: 0x8816, pc: 0x5432 });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });
});
