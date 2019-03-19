/* global describe, test, expect */

import {
  createCpuWithRegisters, createMemorySnapshot,
  createMmu
} from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { GROUPED_WORD_REGISTERS, GroupedWordRegister } from "../registers";
import { createPopRr } from "../pop";

describe("pop", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createPopRr", () => {
    test.each(GROUPED_WORD_REGISTERS.map(r => [r]))("POP %s", (register: GroupedWordRegister) => {
      cpu.registers.sp = 0xf123;
      mmu.writeWordBigEndian(0xf123, 0x142e);

      // Pop two bytes off stack into register pair nn.
      //   Increment Stack Pointer (SP) twice.

      const mmuSnapshot = createMemorySnapshot(mmu);
      const instruction = createPopRr(0x3d, register);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x142e, sp: 0xf125 }));
      expect(createMemorySnapshot(mmu)).toEqual(mmuSnapshot);
    });
  });
});
