/* global describe, test, expect */

import { Memory } from "../../memory";
import { Cpu } from "../types";
import { create as createCpu } from "../";
import { createCpuWithRegisters } from "../../test/help";
import { createJrNzN } from "../jr";

describe("jr", () => {
  let cpu: Cpu;
  let memory: Memory;

  beforeEach(() => {
    cpu = createCpu();
    memory = new Memory();
  });

  describe("createJrNzN", () => {
    test("JR NZ,n pass positive", () => {
      cpu.registers.pc = 0x00f5;
      cpu.registers.f = 0x00;
      expect(cpu.registers.fNz).toBe(0); // Sanity check
      memory.writeByte(0x00f5, 0x03);

      const memorySnapshot = memory.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x00f9, f: 0x00 }));
      expect(memory).toEqual(memorySnapshot);
    });

    test("JR NZ,n pass negative", () => {
      cpu.registers.pc = 0x00f5;
      cpu.registers.f = 0x00;
      expect(cpu.registers.fNz).toBe(0); // Sanity check
      memory.writeByte(0x00f5, 0xfd); // -3

      const memorySnapshot = memory.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x00f3, f: 0x00 }));
      expect(memory).toEqual(memorySnapshot);
    });

    test("JR NZ,n skip", () => {
      cpu.registers.pc = 0x00f5;
      cpu.registers.f = 0x80;
      expect(cpu.registers.fNz).toBe(1); // Sanity check
      memory.writeByte(0x00f5, 0x03);

      const memorySnapshot = memory.copy();
      const instruction = createJrNzN(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x00f6, f: 0x80 }));
      expect(memory).toEqual(memorySnapshot);
    });
  });

  //   self.PC += 2
  //   if self.fNZ:
  //     self.PC += getSignedInt8(v)
  //     self.PC &= 0xFFFF
  //     return 0
  //   else:
  //     self.PC &= 0xFFFF
  //     return 1
});
