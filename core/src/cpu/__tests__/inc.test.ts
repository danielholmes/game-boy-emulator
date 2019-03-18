/* global describe, test, expect */

import { Memory } from "../../memory";
import each from "jest-each";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import { createCpuWithRegisters } from "../../test/help";
import { createIncRr, createIncSp } from "../inc";
import { GROUPED_WORD_REGISTERS, GroupedWordRegister } from "../registers";

describe("inc", () => {
  let cpu: Cpu;
  let memory: Memory;

  beforeEach(() => {
    cpu = createCpu();
    memory = new Memory();
  });

  describe("createIncRr", () => {
    each(GROUPED_WORD_REGISTERS.map(r => [r])).test(
      "INC %s",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0x2314;

        const instruction = createIncRr(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(4);
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x2315 }));
        expect(memory).toEqual(new Memory());
      }
    );
  });

  describe("createIncSp", () => {
    test("success", () => {
      cpu.registers.sp = 0x1234;

      const instruction = createIncSp(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ sp: 0x1235 }));
      expect(memory).toEqual(new Memory());
    });
  });
});
