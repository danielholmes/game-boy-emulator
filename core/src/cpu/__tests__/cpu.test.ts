/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { Cpu } from "../";
import {
  createMmu,
  createMmuWithCartridgeAndValues
} from "../../test/help";
import { OpCode } from "../instructions";
import { Cartridge } from "../../cartridge";
import bios from "../../bios";
import { IOMemory, OamMemory, VRam, WorkingRam, ZeroPageRam } from "../..";
import { V_RAM_SIZE } from "../../memory/ram";

describe("cpu", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("Cpu", () => {
    test("runs NOP", () => {
      const cartridge = new Cartridge(new Uint8Array([0x00]));
      mmu.loadCartridge(cartridge);
      cpu.registers.pc = 0x0000;

      cpu.tickCycle(mmu);

      expect(cpu).toEqualCpuWithRegisters({ pc: 0x0001 });
      expect(mmu).toEqual(createMmuWithCartridgeAndValues(cartridge));
    });

    test("runs single operand", () => {
      const cartridge = new Cartridge(new Uint8Array([0x06, 0x66]));
      mmu.loadCartridge(cartridge);
      cpu.registers.pc = 0x0000;

      cpu.tickCycle(mmu);

      expect(cpu).toEqualCpuWithRegisters({ b: 0x66, pc: 0x0002 });
      expect(mmu).toEqual(createMmuWithCartridgeAndValues(cartridge));
    });

    test("runs smoke test on bios", () => {
      const vRam = VRam.initializeRandomly();
      mmu = new Mmu(
        bios,
        new WorkingRam(),
        vRam,
        new IOMemory(),
        new OamMemory(),
        new ZeroPageRam()
      );

      const ops: OpCode[] = [];
      while (ops.length < 24580) {
        ops.push(mmu.readByte(cpu.registers.pc));
        cpu.tickCycle(mmu);
      }

      expect(ops.slice(0, 12)).toEqual([
        0x31,
        0xaf,
        0x21,
        0x32,
        0xcb,
        0x20,
        0x32,
        0xcb,
        0x20,
        0x32,
        0xcb,
        0x20
      ]);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x00,
        b: 0x00,
        c: 0x00,
        d: 0x00,
        e: 0x00,
        h: 0xff,
        l: 0x26,
        f: 0xa0,
        pc: 0x000f,
        sp: 0xfffe
      });
      // Bios clears out vram to all 0
      expect(vRam.getValues()).toEqual(new Uint8Array(V_RAM_SIZE));
      // A lot of memory, not easy to specify/check it
      // expect(memory).toEqual(createMmuWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    });
  });
});
