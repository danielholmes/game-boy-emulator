/* global describe, test, expect */
import { createMmuSnapshot, createMmu } from "../../test/help";
import { createJrCcN, createJrN } from "../jr";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { Cartridge, CARTRIDGE_PROGRAM_START } from "../../cartridge";
import { CHECK_FLAGS, CheckFlag } from "../lowLevel";

describe("jr", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createJrCcN", () => {
    describe.each(CHECK_FLAGS.map(f => [f]))("JR %s,n", (flag: CheckFlag) => {
      test("pass positive", () => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START + 1;
        cpu.registers[flag] = 1;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x03]));

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 5, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });

      test("pass negative", () => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START + 4;
        cpu.registers[flag] = 1;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x00, 0x00, 0x00, 0xfd]));

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 2, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });

      test("skip", () => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START + 1;
        cpu.registers[flag] = 0;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x03]));

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 2, [flag]: 0 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });
    });
  });

  describe("createJrN", () => {
    test("positive", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START + 1;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x03]));

      const memorySnapshot = createMmuSnapshot(mmu);
      const instruction = createJrN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 5 });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });

    test("negative", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START + 4;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x00, 0x00, 0x00, 0x00, 0xfd]));

      const memorySnapshot = createMmuSnapshot(mmu);
      const instruction = createJrN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 2 });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });
});
