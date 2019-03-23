/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import {
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
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "XOR %s",
      (register: ByteRegister) => {
        cpu.registers.a = 0x01;
        cpu.registers[register] = 0x12;

        const instruction = createXorR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({ a: 0x12, [register]: 0x12 });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });
});
