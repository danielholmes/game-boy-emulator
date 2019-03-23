/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createXorR } from "../xor";
import { Cpu } from "..";

describe("xor", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createXorR", () => {
    describe.each(BYTE_REGISTERS.map(r => [r]))(
      "XOR %s",
      (register: ByteRegister) => {
        test("positive and zero", () => {
          cpu.registers.a = 0x12;
          cpu.registers[register] = 0x00;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createXorR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            a: 0x12,
            [register]: 0x00,
            fZ: register === "a" ? 1 : 0,
            fC: 0,
            fH: 0,
            fN: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("0 false", () => {
          cpu.registers.a = 0x00;
          cpu.registers[register] = 0x00;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createXorR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            a: 0x00,
            [register]: 0x00,
            fZ: 1,
            fC: 0,
            fH: 0,
            fN: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("positive false", () => {
          cpu.registers.a = 0xfe;
          cpu.registers[register] = 0x05;
          cpu.registers.setFFromParts(1, 1, 1, 1);

          const instruction = createXorR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            a: 0xfb,
            [register]: register === "a" ? 0x00 : 0x05,
            fZ: register === "a" ? 1 : 0,
            fC: 0,
            fH: 0,
            fN: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });
});
