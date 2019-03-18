/* global describe, expect */

import { Memory, Mmu } from "../../memory";
import each from "jest-each";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import { createCpuWithRegisters, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createCbBit } from "../cb";

describe("cb", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = createCpu();
    mmu = new Mmu(new Memory());
  });

  describe("createCb", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "CB %s",
      (register: ByteRegister) => {
        cpu.registers[register] = 0x14;

        const instruction = createCbBit(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqual(
          createCpuWithRegisters({ [register]: 0x14, f: 0xa0 })
        );
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
