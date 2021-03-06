import { Mmu } from "../../memory/mmu";
import { Cpu } from "../";
import { createMmu, createMmuSnapshot } from "../../test/help";
import { OpCode } from "../instructions";
import { Cartridge, CARTRIDGE_PROGRAM_START } from "../../cartridge";
import bios from "../../bios";
import { OamMemory, VRam, WorkingRam, ZeroPageRam } from "../..";
import { V_RAM_SIZE } from "../../memory/ram";

describe("cpu", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("Cpu", () => {
    test("runs NOP", () => {
      mmu.loadCartridge(Cartridge.buildWithProgram([0x00]));
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      const mmuSnapshot = createMmuSnapshot(mmu);

      cpu.tickCycle(mmu);

      expect(cpu).toEqualCpuWithRegisters({ pc: CARTRIDGE_PROGRAM_START + 1 });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });

    test("runs single operand", () => {
      mmu.loadCartridge(Cartridge.buildWithProgram([0x06, 0x66]));
      cpu.registers.pc = CARTRIDGE_PROGRAM_START;
      const mmuSnapshot = createMmuSnapshot(mmu);

      cpu.tickCycle(mmu);

      expect(cpu).toEqualCpuWithRegisters({
        pc: CARTRIDGE_PROGRAM_START + 2,
        b: 0x66
      });
      expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
    });

    test("runs smoke test on bios", () => {
      const vRam = VRam.initializeRandomly();
      mmu = new Mmu(
        bios,
        new WorkingRam(),
        vRam,
        new OamMemory(),
        new ZeroPageRam()
      );

      const ops: OpCode[] = [];
      while (ops.length < 24580) {
        ops.push(mmu.readByte(cpu.registers.pc));
        cpu.tickCycle(mmu);
      }

      expect(ops.slice(0, 12)).toEqual([
        0x31,
        0xaf,
        0x21,
        0x32,
        0xcb,
        0x20,
        0x32,
        0xcb,
        0x20,
        0x32,
        0xcb,
        0x20
      ]);
      // See Pan Docs "Power Up Sequence" section for these values
      // Note: Not working atm
      /*expect(cpu).toEqualCpuWithRegisters({
        a: 0x01,
        b: 0x00,
        c: 0x13,
        d: 0x00,
        e: 0xd8,
        h: 0x01,
        l: 0x4d,
        f: 0xb0,
        pc: 0x0100,
        sp: 0xfffe
      });*/
      expect(cpu).toEqualCpuWithRegisters({
        a: 0x00,
        b: 0x00,
        c: 0x00,
        d: 0x00,
        e: 0x00,
        h: 0xff,
        l: 0x26,
        f: 0xa0,
        pc: 0x000f,
        sp: 0xfffe
      });
      // Bios clears out vram to all 0
      expect(vRam.values).toEqual(new Uint8Array(V_RAM_SIZE));
      // TODO: Check special registers from pandocs
    });
  });
});
