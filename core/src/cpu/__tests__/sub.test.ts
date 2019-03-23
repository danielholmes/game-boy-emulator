/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
  createCpuWithRegisters,
  createMemorySnapshot,
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
import { Cpu } from "..";
import { ByteRegister, NON_A_BYTE_REGISTERS } from "../registers";
import { createSubMHl, createSubN, createSubR } from "../sub";
import { binaryToNumber } from "../../types";
import { Cartridge } from "../../cartridge";

describe("sub", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createSubR", () => {
    test("SUB a", () => {
      cpu.registers.a = 0x99;
      cpu.registers.f = binaryToNumber("00000000");

      const instruction = createSubR(0x3d, "a");

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqual(
        createCpuWithRegisters({
          a: 0x00,
          fZ: 1,
          fN: 1,
          fH: 0,
          fC: 0
        })
      );
      expect(mmu).toEqual(EMPTY_MEMORY);
    });

    test.each(NON_A_BYTE_REGISTERS.map(r => [r]))(
      "SUB %s no carries",
      (register: ByteRegister) => {
        cpu.registers.a = 0x99;
        cpu.registers[register] = 0x07;
        cpu.registers.f = binaryToNumber("10000000");

        const instruction = createSubR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqual(
          createCpuWithRegisters({
            a: 0x92,
            [register]: 0x07,
            fZ: 0,
            fN: 1,
            fH: 0,
            fC: 0
          })
        );
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });

  test.each(NON_A_BYTE_REGISTERS.map(r => [r]))(
    "SUB %s carries",
    (register: ByteRegister) => {
      cpu.registers.a = 0x16;
      cpu.registers[register] = 0x27;
      cpu.registers.f = binaryToNumber("10000000");

      const instruction = createSubR(0x3d, register);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqual(
        createCpuWithRegisters({
          a: 0xef,
          [register]: 0x27,
          fZ: 0,
          fN: 1,
          fH: 1,
          fC: 1
        })
      );
      expect(mmu).toEqual(EMPTY_MEMORY);
    }
  );

  describe("createSubMHl", () => {
    test("SUB (hl)", () => {
      cpu.registers.a = 0x99;
      cpu.registers.hl = 0x9876;
      cpu.registers.f = binaryToNumber("10000000");
      mmu.writeByte(0x9876, 0x07);

      const instruction = createSubMHl(0x3d);

      const memorySnapshot = createMemorySnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(
        createCpuWithRegisters({
          a: 0x92,
          hl: 0x9876,
          fZ: 0,
          fN: 1,
          fH: 0,
          fC: 0
        })
      );
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });

  describe("createSubN", () => {
    test("SUB n", () => {
      cpu.registers.a = 0x99;
      cpu.registers.pc = 0x0000;
      cpu.registers.f = binaryToNumber("10000000");
      mmu.loadCartridge(new Cartridge(new Uint8Array([0x07])));

      const instruction = createSubN(0x3d);

      const memorySnapshot = createMemorySnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(
        createCpuWithRegisters({
          a: 0x92,
          pc: 0x0001,
          fZ: 0,
          fN: 1,
          fH: 0,
          fC: 0
        })
      );
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });
});
