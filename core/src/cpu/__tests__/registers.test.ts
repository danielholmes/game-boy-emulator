/* global describe, test, expect */

import { createCpuRegistersWithRegisters } from "../../test/help";
import { CpuRegisters, CpuRegistersImpl } from "../registers";

describe("registers", () => {
  let registers: CpuRegisters;

  beforeEach(() => {
    registers = new CpuRegistersImpl();
  });

  test("set hl", () => {
    registers.hl = 0xfe12;

    expect(registers).toEqual(
      createCpuRegistersWithRegisters({ h: 0xfe, l: 0x12 })
    );
  });

  describe("fNz", () => {
    test("true", () => {
      registers.f = 0x80;

      expect(registers.fNz).toEqual(1);
    });

    test("false", () => {
      registers.f = 0x00;

      expect(registers.fNz).toEqual(0);
    });
  });
});
