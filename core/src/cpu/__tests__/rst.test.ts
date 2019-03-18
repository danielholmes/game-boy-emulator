/* global describe, expect */

import { Memory } from "../../memory";
import each from "jest-each";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import {
  createCpuWithRegisters,
  createMemoryWithValues
} from "../../test/help";
import { createRst, RST_ADDRESSES, RstAddress } from "../rst";

describe("rst", () => {
  let cpu: Cpu;
  let memory: Memory;

  beforeEach(() => {
    cpu = createCpu();
    memory = new Memory();
  });

  describe("createRst", () => {
    each(RST_ADDRESSES.map(a => [a])).test("RST %s", (address: RstAddress) => {
      cpu.registers.sp = 0x0014;
      cpu.registers.pc = 0xabcd;

      const instruction = createRst(0x3d, address);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(32);
      expect(cpu).toEqual(createCpuWithRegisters({ sp: 0x0012, pc: address }));
      expect(memory).toEqual(
        createMemoryWithValues({ 0x0012: 0xab, 0x0013: 0xcd })
      );
    });
  });
});
