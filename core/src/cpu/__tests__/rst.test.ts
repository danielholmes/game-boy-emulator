/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
  createCpuWithRegisters,
  createMmu,
  createMmuWithValues
} from "../../test/help";
import { createRst, RST_ADDRESSES, RstAddress } from "../rst";
import { Cpu } from "..";

describe("rst", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createRst", () => {
    test.each(RST_ADDRESSES.map(a => [a]))("RST %s", (address: RstAddress) => {
      cpu.registers.sp = 0x8814;
      cpu.registers.pc = 0xabcd;

      const instruction = createRst(0x3d, address);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(32);
      expect(cpu).toEqual(createCpuWithRegisters({ sp: 0x8812, pc: address }));
      expect(mmu).toEqual(createMmuWithValues({ 0x8812: 0xcd, 0x8813: 0xab }));
    });
  });
});
