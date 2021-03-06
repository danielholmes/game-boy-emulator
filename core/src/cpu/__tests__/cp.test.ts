/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmuSnapshot, createMmu, EMPTY_MEMORY } from "../../test/help";
import { Cpu } from "..";
import { ByteRegister, NON_A_BYTE_REGISTERS } from "../registers";
import { createCpMHl, createCpN, createCpR } from "../cp";
import { Cartridge } from "../../cartridge";

describe("cp", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCpR", () => {
    test("CP a", () => {
      cpu.registers.a = 0x99;
      cpu.registers.f = 0b00000000;

      const instruction = createCpR(0x3d, "a");

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x99,
        fZ: 1,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toEqual(EMPTY_MEMORY);
    });

    describe.each(NON_A_BYTE_REGISTERS.map(r => [r]))(
      "CP %s",
      (register: ByteRegister) => {
        test("no carries", () => {
          cpu.registers.a = 0x99;
          cpu.registers[register] = 0x07;
          cpu.registers.f = 0b10000000;

          const instruction = createCpR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            a: 0x99,
            [register]: 0x07,
            fZ: 0,
            fN: 1,
            fH: 0,
            fC: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("carries", () => {
          cpu.registers.a = 0x16;
          cpu.registers[register] = 0x27;
          cpu.registers.f = 0b10000000;

          const instruction = createCpR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            a: 0x16,
            [register]: 0x27,
            fZ: 0,
            fN: 1,
            fH: 1,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });

  describe("createCpMHl", () => {
    test("CP (hl)", () => {
      cpu.registers.a = 0x99;
      cpu.registers.hl = 0x9876;
      cpu.registers.f = 0b10000000;
      mmu.writeByte(0x9876, 0x07);

      const instruction = createCpMHl(0x3d);

      const memorySnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x99,
        hl: 0x9876,
        fZ: 0,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });

  describe("createCpN", () => {
    test("CP n", () => {
      cpu.registers.a = 0x99;
      cpu.registers.pc = 0x0000;
      cpu.registers.f = 0b10000000;
      mmu.loadCartridge(new Cartridge(new Uint8Array([0x07])));

      const instruction = createCpN(0x3d);

      const memorySnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x99,
        pc: 0x0001,
        fZ: 0,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });
});
