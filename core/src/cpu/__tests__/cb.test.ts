/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuSnapshot, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createCbBitBMHl, createCbBitBR } from "../cb";
import { Cpu } from "../index";
import { flatMap } from "lodash";
import { BYTE_BIT_POSITIONS, ByteBitPosition } from "../../types";

describe("cb", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCbBitBR", () => {
    describe.each(flatMap(
      BYTE_BIT_POSITIONS.map(p => BYTE_REGISTERS.map(r => [p, r]))
    ) as [ByteBitPosition, ByteRegister][])(
      "CB %s, %s",
      (position: ByteBitPosition, register: ByteRegister) => {
        test("true", () => {
          cpu.registers[register] = 0b11111111;
          cpu.registers.fC = 1;

          const instruction = createCbBitBR(0x3d, position, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0b11111111,
            fZ: 0,
            fN: 0,
            fH: 1,
            fC: 1
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });

        test("false", () => {
          cpu.registers[register] = 0x00;
          cpu.registers.fC = 0;

          const instruction = createCbBitBR(0x3d, position, register);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(0);
          expect(cpu).toEqualCpuWithRegisters({
            [register]: 0x00,
            fZ: 1,
            fN: 0,
            fH: 1,
            fC: 0
          });
          expect(mmu).toEqual(EMPTY_MEMORY);
        });
      }
    );
  });

  describe("createCbBitBMHl", () => {
    describe.each(BYTE_BIT_POSITIONS.map(p => [p]))(
      "CB %s, (hl)",
      (position: ByteBitPosition) => {
        test("true", () => {
          cpu.registers.hl = 0xef37;
          cpu.registers.fC = 1;
          mmu.writeByte(0xef37, 0b11111111);

          const mmuSnapshot = createMmuSnapshot(mmu);
          const instruction = createCbBitBMHl(0x3d, position);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(4);
          expect(cpu).toEqualCpuWithRegisters({
            hl: 0xef37,
            fZ: 0,
            fN: 0,
            fH: 1,
            fC: 1
          });
          expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
        });

        test("false", () => {
          cpu.registers.hl = 0xef37;
          cpu.registers.fC = 0;
          mmu.writeByte(0xef37, 0b00000000);

          const mmuSnapshot = createMmuSnapshot(mmu);
          const instruction = createCbBitBMHl(0x3d, position);

          const cycles = instruction.execute(cpu, mmu);

          expect(cycles).toBe(4);
          expect(cpu).toEqualCpuWithRegisters({
            hl: 0xef37,
            fZ: 1,
            fN: 0,
            fH: 1,
            fC: 0
          });
          expect(mmu).toMatchSnapshotWorkingRam(mmuSnapshot);
        });
      }
    );
  });
});
