/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { Cpu } from "..";
import { sbcAR } from "../sbc";

describe("sbc", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("sbcAR", () => {
    describe.each(BYTE_REGISTERS.map(r => [r]))(
      "SBC a,%s",
      (register: ByteRegister) => {
        test("normal", () => {
          cpu.registers.a = 0xef;
          cpu.registers[register] = 0xe0;

          const instruction = sbcAR(0x3d, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0xe0,
            a: register === "a" ? 0x00 : 0x0f,
            fZ: register === "a" ? 1 : 0,
            fN: 1,
            fH: 0,
            fC: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });
});
