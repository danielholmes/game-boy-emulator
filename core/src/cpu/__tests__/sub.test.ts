/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmuSnapshot, createMmu, EMPTY_MEMORY } from "../../test/help";
import { Cpu } from "..";
import { ByteRegister, NON_A_BYTE_REGISTERS } from "../registers";
import { subMHl, subN, subR } from "../sub";
import { binaryToNumber } from "../../types";
import { Cartridge, CARTRIDGE_PROGRAM_START } from "../../cartridge";

describe("sub", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("subR", () => {
    test("SUB a", () => {
      cpu.registers.a = 0x99;
      cpu.registers.f = binaryToNumber("00000000");

      const instruction = subR(0x3d, "a");

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x00,
        fZ: 1,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toEqual(EMPTY_MEMORY);
    });

    test.each(NON_A_BYTE_REGISTERS.map(r => [r]))(
      "SUB %s no carries",
      (register: ByteRegister) => {
        cpu.registers.a = 0x99;
        cpu.registers[register] = 0x07;
        cpu.registers.f = binaryToNumber("10000000");

        const instruction = subR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          a: 0x92,
          [register]: 0x07,
          fZ: 0,
          fN: 1,
          fH: 0,
          fC: 0
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );

    test.each(NON_A_BYTE_REGISTERS.map(r => [r]))(
      "SUB %s carries",
      (register: ByteRegister) => {
        cpu.registers.a = 0x16;
        cpu.registers[register] = 0x27;
        cpu.registers.f = binaryToNumber("10000000");

        const instruction = subR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          a: 0xef,
          [register]: 0x27,
          fZ: 0,
          fN: 1,
          fH: 1,
          fC: 1
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });

  describe("subMHl", () => {
    test("SUB (hl)", () => {
      cpu.registers.a = 0x99;
      cpu.registers.hl = 0x9876;
      cpu.registers.f = binaryToNumber("10000000");
      mmu.writeByte(0x9876, 0x07);

      const instruction = subMHl(0x3d);

      const memorySnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x92,
        hl: 0x9876,
        fZ: 0,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });

  describe("subN", () => {
    test("SUB n", () => {
      cpu.registers.a = 0x99;
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      cpu.registers.f = binaryToNumber("10000000");
      mmu.loadCartridge(Cartridge.buildWithProgram([0x07]));

      const instruction = subN(0x3d);

      const memorySnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x92,
        pc: CARTRIDGE_PROGRAM_START + 1,
        fZ: 0,
        fN: 1,
        fH: 0,
        fC: 0
      });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });
});
