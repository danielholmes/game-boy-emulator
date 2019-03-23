/* global describe, test, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { Cpu } from "..";
import { createSbcAR } from "../sbc";
import { binaryToNumber } from "../../types";

describe("sbc", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createSbcAR", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "SBC a,%s",
      (register: ByteRegister) => {
        cpu.registers.a = 0xef;
        cpu.registers[register] = 0xe0;

        const instruction = createSbcAR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: 0xe0,
          a: register === "a" ? 0x00 : 0x0f,
          f:
            register === "a"
              ? binaryToNumber("11000000")
              : binaryToNumber("01000000")
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
