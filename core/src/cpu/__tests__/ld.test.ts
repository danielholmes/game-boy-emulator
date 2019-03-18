/* global describe, test, expect */

import { Memory } from "../../memory";
import each from "jest-each";
import {
  BYTE_REGISTER_PAIR_PERMUTATIONS,
  BYTE_REGISTERS,
  ByteRegister,
  GroupedWordRegister
} from "../registers";
import { Cpu } from "../types";
import { copyCpu, create as createCpu } from "../";
import {
  createLdAMNn,
  createLddMHlA,
  createLdGrM,
  createLdGrNn,
  createLdHlMN,
  createLdHlMR,
  createLdMNnA,
  createLdMNnSp,
  createLdMRA,
  createLdRHlM,
  createLdRN,
  createLdRR,
  createLdSpNn
} from "../ld";
import {
  createCpuWithRegisters,
  createMemoryWithValues
} from "../../test/help";

const EMPTY_MEMORY = new Memory();

describe("ld", () => {
  let cpu: Cpu;
  let memory: Memory;

  beforeEach(() => {
    cpu = createCpu();
    memory = new Memory();
  });

  describe("createLdRR", () => {
    each(
      BYTE_REGISTER_PAIR_PERMUTATIONS.map(p => p as ReadonlyArray<ByteRegister>)
    ).test("LD %s,%s", (register1: ByteRegister, register2: ByteRegister) => {
      cpu.registers[register2] = 0x72;

      const instruction = createLdRR(0x3d, register1, register2);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(
        createCpuWithRegisters({ [register1]: 0x72, [register2]: 0x72 })
      );
      expect(memory).toEqual(EMPTY_MEMORY);
    });
  });

  describe("createLdRN", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD %s,n",
      (register: ByteRegister) => {
        cpu.registers.pc = 0x0022;
        memory.writeByte(0x0022, 0x77);

        const instruction = createLdRN(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ [register]: 0x77, pc: 0x23 })
        );
        expect(memory).toEqual(createMemoryWithValues({ 0x22: 0x77 }));
      }
    );
  });

  describe("createLdRHlM", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD %s,(hl)",
      (register: ByteRegister) => {
        cpu.registers.h = 0xf1;
        cpu.registers.l = 0x08;
        memory.writeByte(0xf108, 0x77);

        const instruction = createLdRHlM(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ h: 0xf1, l: 0x08, [register]: 0x77 })
        );
        expect(memory).toEqual(createMemoryWithValues({ 0xf108: 0x77 }));
      }
    );
  });

  describe("createLdHlMR", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD (hl),%s",
      (register: ByteRegister) => {
        cpu.registers.h = 0xf1;
        cpu.registers.l = 0x08;
        if (register !== "h" && register !== "l") {
          cpu.registers[register] = 0x75;
        }

        const instruction = createLdHlMR(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ [register]: 0x75, h: 0xf1, l: 0x08 })
        );
        expect(memory).toEqual(
          createMemoryWithValues({ 0xf108: cpu.registers[register] })
        );
      }
    );
  });

  describe("createLdHlMN", () => {
    test("LD (hl),n", () => {
      cpu.registers.h = 0xf1;
      cpu.registers.l = 0x08;
      cpu.registers.pc = 0xcc;
      memory.writeByte(0xcc, 0xb1);

      const instruction = createLdHlMN(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(12);
      expect(cpu).toEqual(
        createCpuWithRegisters({ pc: 0xcd, h: 0xf1, l: 0x08 })
      );
      expect(memory).toEqual(
        createMemoryWithValues({ 0xf108: 0xb1, 0xcc: 0xb1 })
      );
    });
  });

  describe("createLdGrM", () => {
    each([["bc"], ["de"]]).test(
      "LD a,(%s)",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xf108;
        memory.writeByte(0xf108, 0x2d);
        const memorySnapshot = memory.copy();

        const instruction = createLdGrM(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0x2d, [register]: 0xf108 })
        );
        expect(memory).toEqual(memorySnapshot);
      }
    );
  });

  describe("createLdAMNn", () => {
    test("LD a,(nn)", () => {
      cpu.registers.pc = 0xcc;
      memory.writeWord(0xcc, 0xb116);
      memory.writeWord(0xb116, 0xaa21);

      const memorySnapshot = memory.copy();
      const instruction = createLdAMNn(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(16);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0xce, a: 0xaa }));
      expect(memory).toEqual(memorySnapshot);
    });
  });

  describe("createLdMRA", () => {
    each([["bc"], ["de"]]).test(
      "LD (%s),a",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xf108;
        cpu.registers.a = 0x56;

        const instruction = createLdMRA(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0x56, [register]: 0xf108 })
        );
        expect(memory).toEqual(createMemoryWithValues({ 0xf108: 0x56 }));
      }
    );
  });

  describe("createLdMNnA", () => {
    test("LD (nn),a", () => {
      cpu.registers.a = 0x32;
      cpu.registers.pc = 0xcc;
      memory.writeWord(0xcc, 0xb116);

      const cpuSnapshot = copyCpu(cpu);
      const instruction = createLdMNnA(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(16);
      expect(cpu).toEqual(cpuSnapshot);
      expect(memory).toEqual(
        createMemoryWithValues({ 0xcc: 0xb1, 0xcd: 0x16, 0xb116: 0x32 })
      );
    });
  });

  describe("createLdGrNn", () => {
    each([["bc"], ["de"], ["hl"]]).test(
      "LD %s,nn",
      (register: GroupedWordRegister) => {
        cpu.registers.pc = 0x5601;
        memory.writeWord(0x5601, 0x7654);

        const memorySnapshot = memory.copy();
        const instruction = createLdGrNn(0x3d, register);

        const cycles = instruction.execute(cpu, memory);

        expect(cycles).toBe(12);
        expect(cpu).toEqual(
          createCpuWithRegisters({ pc: 0x5603, [register]: 0x7654 })
        );
        expect(memory).toEqual(memorySnapshot);
      }
    );
  });

  describe("createLdSpNn", () => {
    test("LD sp,nn", () => {
      cpu.registers.pc = 0x5601;
      memory.writeWord(0x5601, 0x7654);

      const memorySnapshot = memory.copy();
      const instruction = createLdSpNn(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(12);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x5603, sp: 0x7654 }));
      expect(memory).toEqual(memorySnapshot);
    });
  });

  describe("createLdMNnSp", () => {
    test("LD (nn),sp", () => {
      cpu.registers.pc = 0x5601;
      cpu.registers.sp = 0x1712;
      memory.writeWord(0x5601, 0x7654);

      // self.mb[v] = self.SP & 0xFF
      // self.mb[v+1] = self.SP >> 8
      // self.PC += 3

      const instruction = createLdMNnSp(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(20);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x5603, sp: 0x1712 }));
      expect(memory).toEqual(
        createMemoryWithValues({ 0x7654: 0x17, 0x7655: 0x12, 0x5601: 0x76, 0x5602: 0x54 })
      );
    });
  });

  describe("createLddMHlA", () => {
    test("LDD (HL),A", () => {
      cpu.registers.hl = 0x5612;
      cpu.registers.a = 0xaf;

      const instruction = createLddMHlA(0x3d);

      const cycles = instruction.execute(cpu, memory);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ a: 0xaf, hl: 0x5611 }));
      expect(memory).toEqual(createMemoryWithValues({ 0x5612: 0xaf }));
    });
  });
});
