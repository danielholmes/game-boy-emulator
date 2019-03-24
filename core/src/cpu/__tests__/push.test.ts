/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu } from "../../test/help";
import { Cpu } from "../index";
import { GROUPED_WORD_REGISTERS, GroupedWordRegister } from "../registers";
import { push } from "../push";

describe("push", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("push", () => {
    test.each(GROUPED_WORD_REGISTERS.map(r => [r]))(
      "PUSH %s",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xde34;
        cpu.registers.sp = 0xc444;

        const instruction = push(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ [register]: 0xde34, sp: 0xc442 });
        expect(mmu).toMatchWorkingRam({ 0xc442: 0x34, 0xc443: 0xde });
        expect(cycles).toBe(12);
      }
    );
  });
});
