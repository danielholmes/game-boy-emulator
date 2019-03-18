/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
  createCpuWithRegisters,
  createMmu,
  createMmuWithCartridgeAndValues
} from "../../test/help";
import { Cpu } from "../index";
import { createCallNn } from "../call";
import { Cartridge } from "../../cartridge";

describe("call", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCallNn", () => {
    test("normal", () => {
      // Push address of next instruction onto stack and then jump to address nn
      // call to nn, SP=SP-2, (SP)=PC, PC=nn
      cpu.registers.pc = 0x0001;
      cpu.registers.sp = 0xe444;
      const cart = new Cartridge(new Uint8Array([0x00, 0x54, 0x76]));
      mmu.loadCartridge(cart);

      const instruction = createCallNn(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x7654, sp: 0xe442 }));
      expect(mmu).toEqual(
        createMmuWithCartridgeAndValues(cart, { 0xe442: 0x0001 })
      );
      expect(cycles).toBe(20);
    });
  });
});
