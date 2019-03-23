/* global describe, test, expect */
import { createMmuSnapshot, createMmu } from "../../test/help";
import { createJrCcN, createJrN } from "../jr";
import { Mmu } from "../../memory/mmu";
import { Cpu } from "..";
import { Cartridge } from "../../cartridge";
import { JR_FLAGS, JrFlag } from "../lowLevel";

describe("jr", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createJrCcN", () => {
    describe.each(JR_FLAGS.map(f => [f]))("JR %s,n", (flag: JrFlag) => {
      test("pass positive", () => {
        cpu.registers.pc = 0x0001;
        cpu.registers[flag] = 1;
        mmu.loadCartridge(new Cartridge(new Uint8Array([0x00, 0x03])));

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: 0x0005, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });

      test("pass negative", () => {
        cpu.registers.pc = 0x0004;
        cpu.registers[flag] = 1;
        const cartridge = new Cartridge(
          new Uint8Array([0x00, 0x00, 0x00, 0x00, 0xfd])
        );
        mmu.loadCartridge(cartridge); // -3

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: 0x0002, [flag]: 1 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });

      test("skip", () => {
        cpu.registers.pc = 0x0001;
        cpu.registers[flag] = 0;
        const cartridge = new Cartridge(new Uint8Array([0x00, 0x03]));
        mmu.loadCartridge(cartridge);

        const memorySnapshot = createMmuSnapshot(mmu);
        const instruction = createJrCcN(0x3d, flag);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(4);
        expect(cpu).toEqualCpuWithRegisters({ pc: 0x0002, [flag]: 0 });
        expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
      });
    });
  });

  describe("createJrN", () => {
    test("positive", () => {
      cpu.registers.pc = 0x0001;
      mmu.loadCartridge(new Cartridge(new Uint8Array([0x00, 0x03])));

      const memorySnapshot = createMmuSnapshot(mmu);
      const instruction = createJrN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ pc: 0x0005 });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });

    test("negative", () => {
      cpu.registers.pc = 0x0004;
      const cartridge = new Cartridge(
        new Uint8Array([0x00, 0x00, 0x00, 0x00, 0xfd])
      );
      mmu.loadCartridge(cartridge); // -3

      const memorySnapshot = createMmuSnapshot(mmu);
      const instruction = createJrN(0x3d);

      const cycles = instruction.execute(cpu, mmu);

      expect(cycles).toBe(4);
      expect(cpu).toEqualCpuWithRegisters({ pc: 0x0002 });
      expect(mmu).toMatchSnapshotWorkingRam(memorySnapshot);
    });
  });
});
