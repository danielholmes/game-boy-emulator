/* global describe, expect */

import { Mmu } from "../../memory/mmu";
import { createMmu, createMmuSnapshot, EMPTY_MEMORY } from "../../test/help";
import { BYTE_REGISTERS, ByteRegister } from "../registers";
import { createCbBitBMHl, createCbBitBR } from "../cb";
import { Cpu } from "../index";
import { flatMap } from "lodash";
import {
  binaryToNumber,
  BYTE_BIT_POSITIONS,
  ByteBitPosition
} from "../../types";

describe("cb", () => {
  let cpu: Cpu;
  let mmu: Mmu;

  beforeEach(() => {
    cpu = new Cpu();
    mmu = createMmu();
  });

  describe("createCbBitBR", () => {
    test.each(flatMap(
      BYTE_BIT_POSITIONS.map(p => BYTE_REGISTERS.map(r => [p, r]))
    ) as [ByteBitPosition, ByteRegister][])(
      "CB %s, %s true",
      (position: ByteBitPosition, register: ByteRegister) => {
        cpu.registers[register] = binaryToNumber("11111111");
        cpu.registers.fC = 1;

        const instruction = createCbBitBR(0x3d, position, register);

        const cycles = instruction.execute(cpu, mmu);

        expect(cycles).toBe(0);
        expect(cpu).toEqualCpuWithRegisters({
          [register]: binaryToNumber("11111111"),
          fZ: 0,
          fN: 0,
          fH: 1,
          fC: 1
        });
        expect(mmu).toEqual(EMPTY_MEMORY);
      }
    );

    test.each(flatMap(
      BYTE_BIT_POSITIONS.map(p => BYTE_REGISTERS.map(r => [p, r]))
    ) as [ByteBitPosition, ByteRegister][])(
      "CB %s, %s false",
      (position: ByteBitPosition, register: ByteRegister) => {
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
      }
    );
  });

  describe("createCbBitBMHl", () => {
    test.each(flatMap(
      BYTE_BIT_POSITIONS.map(p => BYTE_REGISTERS.map(r => [p, r]))
    ) as [ByteBitPosition, ByteRegister][])(
      "CB %s, %s true",
      (position: ByteBitPosition, register: ByteRegister) => {
        cpu.registers.hl = 0xef37;
        cpu.registers.fC = 1;
        mmu.writeByte(0xef37, binaryToNumber('11111111'));

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
      }
    );

    test.each(flatMap(
      BYTE_BIT_POSITIONS.map(p => BYTE_REGISTERS.map(r => [p, r]))
    ) as [ByteBitPosition, ByteRegister][])(
      "CB %s, %s false",
      (position: ByteBitPosition, register: ByteRegister) => {
        cpu.registers.hl = 0xef37;
        cpu.registers.fC = 0;
        mmu.writeByte(0xef37, binaryToNumber('00000000'));

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
      }
    );
  });
});
