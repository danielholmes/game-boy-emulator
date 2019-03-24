/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu } from "../../test/help";
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
      cpu.registers.sp = 0xc814;
      cpu.registers.pc = 0xabcd;

      const instruction = createRst(0x3d, address);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqualCpuWithRegisters({ sp: 0xc812, pc: address });
      expect(mmu).toMatchWorkingRam({ 0xc812: 0xcd, 0xc813: 0xab });
    });
  });
});
