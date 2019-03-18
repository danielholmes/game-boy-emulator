/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import each from "jest-each";
import {
  createCpuWithRegisters,
  createMmu,
  EMPTY_MEMORY
} from "../../test/help";
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
    each(BYTE_REGISTERS.map(r => [r])).test(
      "XOR %s",
      (register: ByteRegister) => {
        cpu.registers.a = 0x01;
        cpu.registers[register] = 0x12;

        const instruction = createXorR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0x12, [register]: 0x12 })
        );
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
