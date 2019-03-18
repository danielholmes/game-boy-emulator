/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import each from "jest-each";
import { Cpu } from "..";
import {
  createCpuWithRegisters,
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createDecR } from "../dec";

describe("dec", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createDecR", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "DEC %s",
      (register: ByteRegister) => {
        cpu.registers[register] = 0x0014;

        const instruction = createDecR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqual(createCpuWithRegisters({ [register]: 0x0013 }));
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
