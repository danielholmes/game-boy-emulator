/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { createIncR, createIncRr } from "../inc";
import {
  BYTE_REGISTERS,
  ByteRegister,
  NON_AF_GROUPED_WORD_REGISTERS,
  NonAfGroupedWordRegister
} from "../registers";
import { Cpu } from "..";

describe("inc", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createIncRr", () => {
    describe.each(
      ([...NON_AF_GROUPED_WORD_REGISTERS, "sp"] as (
        | NonAfGroupedWordRegister
        | "sp"
      )[]).map(r => [r])
    )("INC %s", (register: NonAfGroupedWordRegister | "sp") => {
      test("normal", () => {
        cpu.registers[register] = 0x0001;

        const instruction = createIncRr(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: 0x0002,
          fZ: 0,
          fN: 0,
          fH: 0,
          fC: 0
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      });

      test("half carry", () => {
        cpu.registers[register] = 0x00ff;
        cpu.registers.setFFromParts(1, 1, 1, 1);

        const instruction = createIncRr(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: 0x0100,
          fZ: 0,
          fN: 0,
          fH: 1,
          fC: 1
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      });

      test("rotate", () => {
        cpu.registers[register] = 0xffff;
        cpu.registers.setFFromParts(1, 1, 1, 1);

        const instruction = createIncRr(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: 0x0000,
          fZ: 1,
          fN: 0,
          fH: 1,
          fC: 1
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      });
    });
  });

  describe("createIncR", () => {
    describe.each(BYTE_REGISTERS.map(r => [r]))(
      "INC %s",
      (register: ByteRegister) => {
        test("normal", () => {
          cpu.registers[register] = 0x01;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createIncR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x02,
            fZ: 0,
            fN: 0,
            fH: 0,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("half carry", () => {
          cpu.registers[register] = 0x0f;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createIncR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x10,
            fZ: 0,
            fN: 0,
            fH: 1,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("rotate", () => {
          cpu.registers[register] = 0xff;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createIncR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x00,
            fZ: 1,
            fN: 0,
            fH: 1,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });
});
