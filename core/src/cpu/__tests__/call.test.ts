/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuSnapshot, createMmuWithCartridgeAndValues } from "../../test/help";
import { Cpu } from "../index";
import { createCallFNn, createCallNn } from "../call";
import { Cartridge } from "../../cartridge";
import { CHECK_FLAGS, CheckFlag } from "../lowLevel";

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
      cpu.registers.pc = Cartridge.PC_START;
      cpu.registers.sp = 0xe444;
      const cart = Cartridge.newWithNintendoLogo(new Uint8Array([0x54, 0x76]));
      mmu.loadCartridge(cart);

      const instruction = createCallNn(0x3d);
      const memorySnapshot = createMmuSnapshot(mmu);

      const cycles = instruction.execute(cpu, mmu);

      expect(cpu).toEqualCpuWithRegisters({ pc: 0x7654, sp: 0xe442 });
      expect(mmu).toMatchSnapshotWorkingRam(
        createMmuSnapshot(
          createMmuWithCartridgeAndValues(cart, { 0xe442: Cartridge.PC_START })
        )
      );
      expect(cycles).toBe(20);
    });
  });

  describe("createCallFNn", () => {
    describe.each(CHECK_FLAGS.map((f) => [f]))("CALL %s,nn", (flag: CheckFlag) => {
      test("pass", () => {
        cpu.registers.pc = Cartridge.PC_START;
        cpu.registers[flag] = 1;
        const cart = Cartridge.newWithNintendoLogo(new Uint8Array([0x54, 0x76]));
        mmu.loadCartridge(cart);

        const instruction = createCallFNn(0x3d, flag);
        const memorySnapshot = createMmuSnapshot(mmu);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ pc: 0x7654, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
        expect(cycles).toBe(8);
      });

      test("fail", () => {
        cpu.registers.pc = Cartridge.PC_START;
        cpu.registers[flag] = 0;
        const cart = Cartridge.newWithNintendoLogo(new Uint8Array([0x54, 0x76]));
        mmu.loadCartridge(cart);

        const instruction = createCallFNn(0x3d, flag);
        const memorySnapshot = createMmuSnapshot(mmu);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ pc: Cartridge.PC_START + 2, [flag]: 0 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
        expect(cycles).toBe(8);
      });

      // TODO: Only 8 cycles if fail
    });
  });
});
