/* global describe, expect */

import { Memory, Mmu } from "../../memory";
import each from "jest-each";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import {
  createCpuWithRegisters,
  createMmuWithValues
} from "../../test/help";
import { createRst, RST_ADDRESSES, RstAddress } from "../rst";

describe("rst", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = createCpu();
    mmu = new Mmu(new Memory());
  });

  describe("createRst", () => {
    each(RST_ADDRESSES.map(a => [a])).test("RST %s", (address: RstAddress) => {
      cpu.registers.sp = 0x8814;
      cpu.registers.pc = 0xabcd;

      const instruction = createRst(0x3d, address);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(32);
      expect(cpu).toEqual(createCpuWithRegisters({ sp: 0x8812, pc: address }));
      expect(mmu).toEqual(
        createMmuWithValues({ 0x8812: 0xab, 0x8813: 0xcd })
      );
    });
  });
});
