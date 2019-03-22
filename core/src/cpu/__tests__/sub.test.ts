/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
  createCpuWithRegisters, createMemorySnapshot,
  createMmu, EMPTY_MEMORY
} from "../../test/help";
import { Cpu } from "..";
import { ByteRegister, NON_A_BYTE_REGISTERS } from "../registers";
import { createSubMHl, createSubR } from "../sub";
import { binaryToNumber } from "../../types";

describe("sub", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  // TODO:
  // H - Set if no borrow from bit 4.
  // C - Set if no borrow

  describe("createSubR", () => {
    test.each(NON_A_BYTE_REGISTERS.map((r) => [r]))("SUB %s", (register: ByteRegister) => {
      cpu.registers.a = 0x99;
      cpu.registers[register] = 0x07;
      cpu.registers.f = binaryToNumber('10000000');

      const instruction = createSubR(0x3d, register);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqual(createCpuWithRegisters({
        a: 0x92,
        [register]: 0x07,
        fZ: 0,
        fN: 1
      }));
      expect(mmu).toEqual(EMPTY_MEMORY);
    });

    test("SUB a", () => {
      cpu.registers.a = 0x99;
      cpu.registers.f = binaryToNumber('00000000');

      const instruction = createSubR(0x3d, 'a');

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(0);
      expect(cpu).toEqual(createCpuWithRegisters({
        a: 0x00,
        fZ: 1,
        fN: 1
      }));
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });

  describe('createSubMHl', () => {
    test("SUB (hl)", () => {
      cpu.registers.a = 0x99;
      cpu.registers.hl = 0x9876;
      cpu.registers.f = binaryToNumber('10000000');
      mmu.writeByte(0x9876, 0x07);

      const instruction = createSubMHl(0x3d);

      const memorySnapshot = createMemorySnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(createCpuWithRegisters({
        a: 0x92,
        hl: 0x9876,
        fZ: 0,
        fN: 1
      }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });
});
