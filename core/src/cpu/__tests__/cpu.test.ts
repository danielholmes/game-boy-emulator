/* global describe, test, expect */

import { Mmu } from "../../memory";
import bios from "../../bios";
import { create as createCpu, runInstruction } from "../";
import { Cpu } from "../types";
import {
  createCpuWithRegisters,
  createMmu,
  createMmuWithRomAndValues
} from "../../test/help";
import { OpCode } from "../instructions";

describe("cpu", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = createCpu();
    mmu = createMmu();
  });

  describe("runInstruction", () => {
    test("runs NOP", () => {
      mmu.loadCartridge([0x00]);
      cpu.registers.pc = 0x0000;

      runInstruction(cpu, mmu);

      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0001 }));
      expect(mmu).toEqual(createMmuWithRomAndValues([0x00]));
    });

    test("runs single operand", () => {
      mmu.loadCartridge([0x06, 0x66]);
      cpu.registers.pc = 0x0000;

      runInstruction(cpu, mmu);

      expect(cpu).toEqual(createCpuWithRegisters({ b: 0x66, pc: 0x0002 }));
      expect(mmu).toEqual(createMmuWithRomAndValues([0x06, 0x66]));
    });

    test("runs smoke test on bios", () => {
      const ops: OpCode[] = [];
      while (cpu.registers.pc <= bios.length && ops.length < 12) {
        ops.push(mmu.readByte(cpu.registers.pc));
        runInstruction(cpu, mmu);
      }

      expect(ops).toEqual([
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
          h: 0xff,
          l: 0x9c,
          f: 0x20,
          pc: 0x0007,
          sp: 0xfeff
        })
      );
      // A lot of memory, not easy to specify/check it
      // expect(memory).toEqual(createMmuWithValues({ 0x10: 0x06, 0x11: 0x66 }))
    });
  });
});
