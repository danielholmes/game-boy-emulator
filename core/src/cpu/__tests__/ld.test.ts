/* global describe, test, expect */

import {
  BYTE_REGISTER_PAIR_PERMUTATIONS,
  BYTE_REGISTERS,
  ByteRegister,
  NonAfGroupedWordRegister
} from "../registers";
import {
  ldAMNn,
  createLdRMRr,
  createLddMHlA,
  ldGrM,
  ldHlMN,
  ldHlMR,
  ldMFfCA,
  ldMFfNA,
  ldMNnA,
  ldMNnSp,
  ldMRA,
  ldRHlM,
  ldRN,
  createLdRR,
  ldRrNn,
  ldiMHlA,
  ldAMFfN,
  createLdAMFfC
} from "../ld";
import {
  createCpuSnapshot,
  createMmuSnapshot,
  createMmu,
  EMPTY_MEMORY,
  writeWordBigEndian
} from "../../test/help";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { Cartridge, CARTRIDGE_PROGRAM_START } from "../../cartridge";
import { flatMap } from "lodash";

describe("ld", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createLdRR", () => {
    test.each(BYTE_REGISTER_PAIR_PERMUTATIONS)(
      "LD %s,%s",
      (register1: ByteRegister, register2: ByteRegister) => {
        cpu.registers[register2] = 0x72;

        const instruction = createLdRR(0x3d, register1, register2);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register1]: 0x72,
          [register2]: 0x72
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );
  });

  describe("ldRN", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "LD %s,n",
      (register: ByteRegister) => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START + 2;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x00, 0x77]));

        const mmuSnapshot = createMmuSnapshot(mmu);
        const instruction = ldRN(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({
          pc: CARTRIDGE_PROGRAM_START + 3,
          [register]: 0x77
        });
        expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
      }
    );
  });

  describe("ldRHlM", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "LD %s,(hl)",
      (register: ByteRegister) => {
        cpu.registers.hl = 0xc108;
        mmu.writeByte(0xc108, 0x77);

        const instruction = ldRHlM(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ hl: 0xc108, [register]: 0x77 });
        expect(mmu).toMatchWorkingRam({ 0xc108: 0x77 });
      }
    );
  });

  describe("ldHlMR", () => {
    test.each(BYTE_REGISTERS.map(r => [r]))(
      "LD (hl),%s",
      (register: ByteRegister) => {
        cpu.registers.hl = 0xc108;
        if (register !== "h" && register !== "l") {
          cpu.registers[register] = 0x75;
        }

        const instruction = ldHlMR(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ [register]: 0x75, hl: 0xc108 });
        expect(mmu).toMatchWorkingRam({ 0xc108: cpu.registers[register] });
      }
    );
  });

  describe("ldHlMN", () => {
    test("LD (hl),n", () => {
      cpu.registers.hl = 0xc108;
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      mmu.loadCartridge(Cartridge.buildWithProgram([0xb1]));

      const instruction = ldHlMN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqualCpuWithRegisters({
        pc: CARTRIDGE_PROGRAM_START + 1,
        hl: 0xc108
      });
      expect(mmu).toMatchWorkingRam({ 0xc108: 0xb1 });
    });
  });

  describe("ldGrM", () => {
    test.each([["bc"], ["de"]] as NonAfGroupedWordRegister[][])(
      "LD a,(%s)",
      (register: NonAfGroupedWordRegister) => {
        cpu.registers[register] = 0xf108;
        mmu.writeByte(0xf108, 0x2d);

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = ldGrM(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ a: 0x2d, [register]: 0xf108 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      }
    );
  });

  describe("ldMFfNA", () => {
    test("LD (0xff00+n),a", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      cpu.registers.a = 0x12;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x76]));

      const instruction = ldMFfNA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x12,
        pc: CARTRIDGE_PROGRAM_START + 1
      });
      // TODO: Some sort of assert for special registers
      expect(mmu.readByte(0xff76)).toEqual(0x12);
    });
  });

  describe("ldMFfCA", () => {
    test("LD (0xff00+c),a", () => {
      cpu.registers.a = 0x12;
      cpu.registers.c = 0x77;

      const cpuSnapshot = createCpuSnapshot(cpu);
      const instruction = ldMFfCA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      // TODO: Some sort of assert for special registers
      expect(mmu.readByte(0xff77)).toEqual(0x12);
    });
  });

  describe("ldAMNn", () => {
    test("LD a,(nn)", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x16, 0xd1]));
      writeWordBigEndian(mmu, 0xd116, 0xaa21);

      const memorySnapshot = createMmuSnapshot(mmu);
      const instruction = ldAMNn(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(cpu).toEqualCpuWithRegisters({
        pc: CARTRIDGE_PROGRAM_START + 2,
        a: 0x21
      });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });

  describe("ldMRA", () => {
    test.each([["bc"], ["de"], ["hl"]] as NonAfGroupedWordRegister[][])(
      "LD (%s),a",
      (register: NonAfGroupedWordRegister) => {
        cpu.registers.a = 0x72;
        cpu.registers[register] = 0xc108;

        const instruction = ldMRA(0x3d, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ a: 0x72, [register]: 0xc108 });
        expect(mmu).toMatchWorkingRam({ 0xc108: 0x72 });
      }
    );
  });

  describe("ldRrNn", () => {
    test.each([["bc"], ["de"], ["hl"], ["sp"]] as (
      | NonAfGroupedWordRegister
      | "sp")[][])("LD %s,nn", (register: NonAfGroupedWordRegister | "sp") => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      mmu.loadCartridge(Cartridge.buildWithProgram([0xfa, 0xce]));

      const instruction = ldRrNn(0x3d, register);

      const mmuSnapshot = createMmuSnapshot(mmu);
      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqualCpuWithRegisters({
        pc: CARTRIDGE_PROGRAM_START + 2,
        [register]: 0xcefa
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });

  describe("createLdRMRr", () => {
    test.each(flatMap(
      BYTE_REGISTERS.map(r => [[r, "bc"], [r, "de"], [r, "hl"]])
    ) as [ByteRegister, NonAfGroupedWordRegister][])(
      "LD %s,(%s)",
      (register1: ByteRegister, register2: NonAfGroupedWordRegister) => {
        cpu.registers[register2] = 0xf108;
        mmu.writeByte(0xf108, 0xdf);

        const instruction = createLdRMRr(0x3d, register1, register2);

        const memorySnapshot = createMmuSnapshot(mmu);
        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({
          [register2]: 0xf108,
          [register1]: 0xdf
        });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      }
    );
  });

  describe("ldMNnA", () => {
    test("LD (nn),a", () => {
      cpu.registers.a = 0x32;
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x16, 0xc1]));

      const cpuSnapshot = createCpuSnapshot(cpu);
      const instruction = ldMNnA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(12);
      expect(createCpuSnapshot(cpu)).toEqual(cpuSnapshot);
      expect(mmu).toMatchWorkingRam({ 0xc116: 0x32 });
    });
  });

  describe("ldMNnSp", () => {
    test("LD (nn),sp", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      cpu.registers.sp = 0xc712;
      const cart = Cartridge.buildWithProgram([0x54, 0xd6]);
      mmu.loadCartridge(cart);

      const instruction = ldMNnSp(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(16);
      expect(cpu).toEqualCpuWithRegisters({
        pc: CARTRIDGE_PROGRAM_START + 2,
        sp: 0xc712
      });
      expect(mmu).toMatchWorkingRam({ 0xd654: 0x12, 0xd655: 0xc7 });
    });
  });

  describe("createLddMHlA", () => {
    test("LDD (HL),A", () => {
      cpu.registers.hl = 0xc612;
      cpu.registers.a = 0xaf;

      const instruction = createLddMHlA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ a: 0xaf, hl: 0xc611 });
      expect(mmu).toMatchWorkingRam({ 0xc612: 0xaf });
    });
  });

  describe("ldiMHlA", () => {
    test("LDI (HL),A", () => {
      cpu.registers.hl = 0xc612;
      cpu.registers.a = 0xaf;

      const instruction = ldiMHlA(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ a: 0xaf, hl: 0xc613 });
      expect(mmu).toMatchWorkingRam({ 0xc612: 0xaf });
    });
  });

  describe("ldAMFfN", () => {
    test("LD a, (#ff00+n)", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      const cart = Cartridge.buildWithProgram([0x72]);
      mmu.loadCartridge(cart);
      mmu.writeByte(0xff72, 0x62);

      const mmuSnapshot = createMmuSnapshot(mmu);
      const instruction = ldAMFfN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(8);
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x62,
        pc: CARTRIDGE_PROGRAM_START + 1
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });

  describe("createLdAMFfC", () => {
    test("LD a, (#ff00+c)", () => {
      cpu.registers.a = 0x23;
      cpu.registers.c = 0xd1;
      mmu.writeByte(0xffd1, 0x62);

      const mmuSnapshot = createMmuSnapshot(mmu);
      const instruction = createLdAMFfC(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ a: 0x62, c: 0xd1 });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });
  });
});
