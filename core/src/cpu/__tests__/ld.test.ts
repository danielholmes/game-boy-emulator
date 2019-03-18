/* global describe, test, expect */

import each from "jest-each";
import {
  BYTE_REGISTER_PAIR_PERMUTATIONS,
  BYTE_REGISTERS,
  ByteRegister,
  GroupedWordRegister
} from "../registers";
import {
  createLdAMNn,
  createLdAMRr,
  createLddMHlA,
  createLdGrM,
  createLdGrNn,
  createLdHlMN,
  createLdHlMR,
  createLdMCA,
  createLdMNA,
  createLdMNnA,
  createLdMNnSp,
  createLdMRA,
  createLdRHlM,
  createLdRN,
  createLdRR,
  createLdSpNn
} from "../ld";
import {
  createCpuSnapshot,
  createCpuWithRegisters,
  createMemorySnapshot,
  createMmu,
  createMmuWithCartridgeAndValues,
  createMmuWithValues,
  EMPTY_MEMORY
} from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { Cartridge } from "../../cartridge";

describe("ld", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createLdRR", () => {
    each(
      BYTE_REGISTER_PAIR_PERMUTATIONS.map(p => p as ReadonlyArray<ByteRegister>)
    ).test("LD %s,%s", (register1: ByteRegister, register2: ByteRegister) => {
      cpu.registers[register2] = 0x72;

      const instruction = createLdRR(0x3d, register1, register2);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqual(
        createCpuWithRegisters({ [register1]: 0x72, [register2]: 0x72 })
      );
      expect(mmu).toEqual(EMPTY_MEMORY);
    });
  });

  describe("createLdRN", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD %s,n",
      (register: ByteRegister) => {
        cpu.registers.pc = 0x0002;
        const cartridge = new Cartridge(new Uint8Array([0x00, 0x00, 0x77]));
        mmu.loadCartridge(cartridge);

        const instruction = createLdRN(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ [register]: 0x77, pc: 0x0003 })
        );
        expect(mmu).toEqual(createMmuWithCartridgeAndValues(cartridge));
      }
    );
  });

  describe("createLdRHlM", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD %s,(hl)",
      (register: ByteRegister) => {
        cpu.registers.hl = 0xf108;
        mmu.writeByte(0xf108, 0x77);

        const instruction = createLdRHlM(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ hl: 0xf108, [register]: 0x77 })
        );
        expect(mmu).toEqual(createMmuWithValues({ 0xf108: 0x77 }));
      }
    );
  });

  describe("createLdHlMR", () => {
    each(BYTE_REGISTERS.map(r => [r])).test(
      "LD (hl),%s",
      (register: ByteRegister) => {
        cpu.registers.hl = 0xf108;
        if (register !== "h" && register !== "l") {
          cpu.registers[register] = 0x75;
        }

        const instruction = createLdHlMR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ [register]: 0x75, hl: 0xf108 })
        );
        expect(mmu).toEqual(
          createMmuWithValues({ 0xf108: cpu.registers[register] })
        );
      }
    );
  });

  describe("createLdHlMN", () => {
    test("LD (hl),n", () => {
      cpu.registers.hl = 0xf108;
      cpu.registers.pc = 0x0000;
      const cartridge = new Cartridge(new Uint8Array([0xb1]));
      mmu.loadCartridge(cartridge);

      const instruction = createLdHlMN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0001, hl: 0xf108 }));
      expect(mmu).toEqual(
        createMmuWithCartridgeAndValues(cartridge, { 0xf108: 0xb1 })
      );
    });
  });

  describe("createLdGrM", () => {
    each([["bc"], ["de"]]).test(
      "LD a,(%s)",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xf108;
        mmu.writeByte(0xf108, 0x2d);
        const memorySnapshot = createMemorySnapshot(mmu);

        const instruction = createLdGrM(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0x2d, [register]: 0xf108 })
        );
        expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
      }
    );
  });

  describe("createLdMNA", () => {
    test("LD (0xff00+n),a", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.a = 0x12;
      const cart = new Cartridge(new Uint8Array([0x76]));
      mmu.loadCartridge(cart);

      const instruction = createLdMNA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqual(createCpuWithRegisters({ a: 0x12, pc: 0x0001 }));
      expect(mmu).toEqual(
        createMmuWithCartridgeAndValues(cart, { 0xff76: 0x12 })
      );
    });
  });

  describe("createLdMCA", () => {
    test("LD (0xff00+c),a", () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x77;

      const cpuSnapshot = createCpuSnapshot(cpu);
      const instruction = createLdMCA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      expect(mmu).toEqual(createMmuWithValues({ 0xff77: 0x12 }));
    });
  });

  describe("createLdAMNn", () => {
    test("LD a,(nn)", () => {
      cpu.registers.pc = 0x0000;
      const cartridge = new Cartridge(new Uint8Array([0x16, 0xd1]));
      mmu.loadCartridge(cartridge);
      mmu.writeWordBigEndian(0xd116, 0xaa21);

      const memorySnapshot = createMemorySnapshot(mmu);
      const instruction = createLdAMNn(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(16);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0002, a: 0x21 }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });

  describe("createLdMRA", () => {
    each([["bc"], ["de"], ["hl"]]).test(
      "LD (%s),a",
      (register: GroupedWordRegister) => {
        cpu.registers.a = 0x72;
        cpu.registers[register] = 0xf108;

        const instruction = createLdMRA(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0x72, [register]: 0xf108 })
        );
        expect(mmu).toEqual(createMmuWithValues({ 0xf108: 0x72 }));
      }
    );
  });

  describe("createLdAMRr", () => {
    each([["bc"], ["de"], ["hl"]]).test(
      "LD a,(%s)",
      (register: GroupedWordRegister) => {
        cpu.registers[register] = 0xf108;
        mmu.writeByte(0xf108, 0xdf);

        const instruction = createLdAMRr(0x3d, register);

        const memorySnapshot = createMemorySnapshot(mmu);
        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(8);
        expect(cpu).toEqual(
          createCpuWithRegisters({ a: 0xdf, [register]: 0xf108 })
        );
        expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
      }
    );
  });

  describe("createLdMNnA", () => {
    test("LD (nn),a", () => {
      cpu.registers.a = 0x32;
      cpu.registers.pc = 0x0000;
      const cartridge = new Cartridge(new Uint8Array([0x16, 0xc1]));
      mmu.loadCartridge(cartridge);

      const cpuSnapshot = createCpuSnapshot(cpu);
      const instruction = createLdMNnA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(16);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      expect(mmu).toEqual(
        createMmuWithCartridgeAndValues(cartridge, { 0xc116: 0x32 })
      );
    });
  });

  describe("createLdGrNn", () => {
    each([["bc"], ["de"], ["hl"]]).test(
      "LD %s,nn",
      (register: GroupedWordRegister) => {
        cpu.registers.pc = 0x0001;
        const cartridge = new Cartridge(new Uint8Array([0x00, 0x54, 0x76]));
        mmu.loadCartridge(cartridge);

        const memorySnapshot = createMemorySnapshot(mmu);
        const instruction = createLdGrNn(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(12);
        expect(cpu).toEqual(
          createCpuWithRegisters({ pc: 0x0003, [register]: 0x7654 })
        );
        expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
      }
    );
  });

  describe("createLdSpNn", () => {
    test("LD sp,nn", () => {
      cpu.registers.pc = 0x0000;
      const cartridge = new Cartridge(new Uint8Array([0x54, 0x76]));
      mmu.loadCartridge(cartridge);

      const memorySnapshot = createMemorySnapshot(mmu);
      const instruction = createLdSpNn(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0002, sp: 0x7654 }));
      expect(createMemorySnapshot(mmu)).toEqual(memorySnapshot);
    });
  });

  describe("createLdMNnSp", () => {
    test("LD (nn),sp", () => {
      cpu.registers.pc = 0x0000;
      cpu.registers.sp = 0x1712;
      const cartridge = new Cartridge(new Uint8Array([0x54, 0xe6]));
      mmu.loadCartridge(cartridge);

      const instruction = createLdMNnSp(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(20);
      expect(cpu).toEqual(createCpuWithRegisters({ pc: 0x0002, sp: 0x1712 }));
      expect(mmu).toEqual(
        createMmuWithCartridgeAndValues(cartridge, {
          0xe654: 0x12,
          0xe655: 0x17
        })
      );
    });
  });

  describe("createLddMHlA", () => {
    test("LDD (HL),A", () => {
      cpu.registers.hl = 0x9612;
      cpu.registers.a = 0xaf;

      const instruction = createLddMHlA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqual(createCpuWithRegisters({ a: 0xaf, hl: 0x9611 }));
      expect(mmu).toEqual(createMmuWithValues({ 0x9612: 0xaf }));
    });
  });
});
