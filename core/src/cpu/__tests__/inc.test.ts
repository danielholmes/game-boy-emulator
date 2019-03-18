/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import each from "jest-each";
import {
  createCpuWithRegisters,
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
import { createIncRr, createIncSp } from "../inc";
import { GROUPED_WORD_REGISTERS, GroupedWordRegister } from "../registers";
import { Cpu } from "..";

describe("inc", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createIncRr", () => {
    each(GROUPED_WORD_REGISTERS.map(r => [r])).test(
      "INC %s",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0x2314;

        const instruction = createIncRr(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x2315 }));
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });

  describe("createIncSp", () => {
    test("success", () => {
      cpu.registers.sp = 0x1234;

      const instruction = createIncSp(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ sp: 0x1235 }));
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });
});
