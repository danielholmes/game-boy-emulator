/* global describe, test, expect */

import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createRlR } from "../rl";

describe("rl", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createRlR", () => {
    describe.each(BYTE_REGISTERS.map(r => [r]))(
      "RL %s",
      (register: ByteRegister) => {
        test("0", () => {
          cpu.registers[register] = 0b00111000;
          cpu.registers.f = 0b11110000;

          const instruction = createRlR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0b01110001,
            f: 0b00000000
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("1", () => {
          cpu.registers[register] = 0b11010010;
          cpu.registers.f = 0b11100000;

          const instruction = createRlR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0b10100100,
            f: 0b00010000
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("result 0", () => {
          cpu.registers[register] = 0x00;
          cpu.registers.f = 0b11100000;

          const instruction = createRlR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x00,
            f: 0b10000000
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });
});
