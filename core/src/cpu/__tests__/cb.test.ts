/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createCbBit } from "../cb";
import { Cpu } from "../index";

describe("cb", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCb", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "CB %s",
      (register: ByteRegister) => {
        cpu.registers[register] = 0x14;

        const instruction = createCbBit(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({ [register]: 0x14, f: 0xa0 });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
