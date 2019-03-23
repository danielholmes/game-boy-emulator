/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuWithValues } from "../../test/help";
import { Cpu } from "../index";
import { GROUPED_WORD_REGISTERS, GroupedWordRegister } from "../registers";
import { createPush } from "../push";

describe("push", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createPush", () => {
    test.each(GROUPED_WORD_REGISTERS.map(r => [r]))(
      "PUSH %s",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xde34;
        cpu.registers.sp = 0xe444;

        const instruction = createPush(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ [register]: 0xde34, sp: 0xe442 });
        expect(mmu).toEqual(
          createMmuWithValues({ 0xe442: 0x34, 0xe443: 0xde })
        );
        expect(cycles).toBe(12);
      }
    );
  });
});
