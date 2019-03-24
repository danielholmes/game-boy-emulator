/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuSnapshot, wordHighByte, wordLowByte } from "../../test/help";
import { Cpu } from "../index";
import { createCallFNn, createCallNn } from "../call";
import { Cartridge, CARTRIDGE_PROGRAM_START } from "../../cartridge";
import { CHECK_FLAGS, CheckFlag } from "../lowLevel";

describe("call", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCallNn", () => {
    test("normal", () => {
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      cpu.registers.sp = 0xc444;
      mmu.loadCartridge(Cartridge.buildWithProgram([0x54, 0x76]));

      const instruction = createCallNn(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cpu).toEqualCpuWithRegisters({ pc: 0x7654, sp: 0xc442 });
      expect(mmu).toMatchWorkingRam({
        0xc442: wordLowByte(CARTRIDGE_PROGRAM_START),
        0xc443: wordHighByte(CARTRIDGE_PROGRAM_START)
      });
      expect(cycles).toBe(20);
    });
  });

  describe("createCallFNn", () => {
    describe.each(CHECK_FLAGS.map((f) => [f]))("CALL %s,nn", (flag: CheckFlag) => {
      test("pass", () => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START;
        cpu.registers[flag] = 1;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x54, 0x76]));

        const instruction = createCallFNn(0x3d, flag);
        const memorySnapshot = createMmuSnapshot(mmu);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ pc: 0x7654, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
        expect(cycles).toBe(8);
      });

      test("fail", () => {
        cpu.registers.pc = CARTRIDGE_PROGRAM_START;
        cpu.registers[flag] = 0;
        mmu.loadCartridge(Cartridge.buildWithProgram([0x54, 0x76]));

        const instruction = createCallFNn(0x3d, flag);
        const memorySnapshot = createMmuSnapshot(mmu);

        const cycles = instruction.execute(cpu, mmu);

        expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 2, [flag]: 0 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
        expect(cycles).toBe(8);
      });
    });
  });
});
