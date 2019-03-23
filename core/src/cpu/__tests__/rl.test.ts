/* global describe, test, expect */

import {
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createRlR } from "../rl";
import { binaryToNumber } from "../../types";

describe("rl", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createRlR", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "RL %s rotate 0",
      (register: ByteRegister) => {
        cpu.registers[register] = binaryToNumber("00111000");
        cpu.registers.f = binaryToNumber("11110000");

        const instruction = createRlR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: binaryToNumber("01110001"),
          f: binaryToNumber("00000000")
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );

    test.each(BYTE_REGISTERS.map(r => [r]))(
      "RL %s rotate 1",
      (register: ByteRegister) => {
        cpu.registers[register] = binaryToNumber("11010010");
        cpu.registers.f = binaryToNumber("11100000");

        const instruction = createRlR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: binaryToNumber("10100100"),
          f: binaryToNumber("00010000")
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );

    test.each(BYTE_REGISTERS.map(r => [r]))(
      "RL %s result 0",
      (register: ByteRegister) => {
        cpu.registers[register] = 0x00;
        cpu.registers.f = binaryToNumber("11100000");

        const instruction = createRlR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: 0x00,
          f: binaryToNumber("10000000")
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
