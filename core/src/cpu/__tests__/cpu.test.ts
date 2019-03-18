/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { Cpu } from "../";
import {
  createCpuWithRegisters,
  createMmu,
  createMmuWithCartridgeAndValues
} from "../../test/help";
import { OpCode } from "../instructions";
import { Cartridge } from "../../cartridge";

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

      cpu.tick(mmu);

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0001 }));
      expect(mmu).toEqual(createMmuWithCartridgeAndValues(cartridge));
    });

    test("runs single operand", () => {
      const cartridge = new Cartridge(new Uint8Array([0x06, 0x66]));
      mmu.loadCartridge(cartridge);
      cpu.registers.pc = 0x0000;

      cpu.tick(mmu);

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x0002 }));
      expect(mmu).toEqual(createMmuWithCartridgeAndValues(cartridge));
    });

    test("runs smoke test on bios", () => {
      const ops: OpCode[] = [];
      while (ops.length < 50) {
        ops.push(mmu.readByte(cpu.registers.pc));
        cpu.tick(mmu);
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
      expect(cpu).toEqual(
        createCpuWithRegisters({
          a: 0x00,
          b: 0x00,
          c: 0x00,
          d: 0x00,
          e: 0x00,
          h: 0x9f,
          l: 0xef,
          f: 0x20,
          pc: 0x000a,
          sp: 0xfffe
        })
      );
      // A lot of memory, not easy to specify/check it
      // expect(memory).toEqual(createMmuWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    });
  });
});
