/* global describe, test, expect */

import {
  createCpuWithRegisters,
  createMmu, EMPTY_MEMORY
} from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createRlR } from "../rl";

describe("rl", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createRlR", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))("RL %s", (register: ByteRegister) => {
      cpu.registers[register] = 0x14;

      const instruction = createRlR(0x3d, register);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x28 }));
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });
});
