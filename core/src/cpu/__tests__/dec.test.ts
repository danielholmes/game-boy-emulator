/* global describe, expect, test */

import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister, GROUPED_WORD_REGISTERS, WordRegister } from "../registers";
import { createDecR, createDecRr, DecRrRegister } from "../dec";

describe("dec", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createDecR", () => {
    describe.each(BYTE_REGISTERS.map(r => [r]))(
      "DEC %s",
      (register: ByteRegister) => {
        test("positive", () => {
          cpu.registers[register] = 0x03;
          cpu.registers.setFFromParts(1, 0, 1, 1);

          const instruction = createDecR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x02,
            fZ: 0,
            fN: 1,
            fH: 0,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("zero", () => {
          cpu.registers[register] = 0x01;
          cpu.registers.setFFromParts(0, 1, 1, 0);

          const instruction = createDecR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x00,
            fZ: 1,
            fN: 1,
            fH: 0,
            fC: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("half carry", () => {
          cpu.registers[register] = 0x10;
          cpu.registers.setFFromParts(0, 1, 0, 1);

          const instruction = createDecR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x0f,
            fZ: 0,
            fN: 1,
            fH: 1,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("rotate", () => {
          cpu.registers[register] = 0x00;
          cpu.registers.setFFromParts(0, 1, 1, 0);

          const instruction = createDecR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0xff,
            fZ: 0,
            fN: 1,
            fH: 1,
            fC: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });

  describe("createDecRr", () => {
    describe.each(([...GROUPED_WORD_REGISTERS, 'sp'] as DecRrRegister[]).map(r => [r]))(
      "DEC %s",
      (register: DecRrRegister) => {
        test("positive", () => {
          cpu.registers[register] = 0xf239;

          const instruction = createDecRr(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(4);
          expect(cpu).toEqualCpuWithRegisters({ [register]: 0xf238 });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("zero", () => {
          cpu.registers[register] = 0x0001;

          const instruction = createDecRr(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(4);
          expect(cpu).toEqualCpuWithRegisters({ [register]: 0x0000 });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("rotate", () => {
          cpu.registers[register] = 0x0000;

          const instruction = createDecRr(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(4);
          expect(cpu).toEqualCpuWithRegisters({ [register]: 0xffff });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });
});
