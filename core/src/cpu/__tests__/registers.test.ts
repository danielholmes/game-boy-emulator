/* global describe, test, expect */

import { CpuRegisters, CpuRegistersImpl } from "../registers";

describe("registers", () => {
  let registers: CpuRegisters;

  beforeEach(() => {
    registers = new CpuRegistersImpl();
  });

  test("set hl", () => {
    registers.hl = 0xfe12;

    expect(registers).toEqualCpuRegisters({ h: 0xfe, l: 0x12 });
  });

  describe("fZ", () => {
    test("true", () => {
      registers.f = 0b10000000;

      expect(registers.fZ).toBe(1);
      expect(registers.fNz).toBe(0);
    });

    test("false", () => {
      registers.f = 0b00100000;

      expect(registers.fZ).toBe(0);
      expect(registers.fNz).toBe(1);
    });

    test("set", () => {
      registers.f = 0b00000000;
      registers.fZ = 1;

      expect(registers.fZ).toBe(1);
      expect(registers.fNz).toBe(0);
      expect(registers.f).toBe(0b10000000);
    });
  });

  describe("fN", () => {
    test("true", () => {
      registers.f = 0b01000000;

      expect(registers.fN).toBe(1);
    });

    test("false", () => {
      registers.f = 0b00100000;

      expect(registers.fN).toBe(0);
    });

    test("set", () => {
      registers.f = 0b10000000;
      registers.fN = 1;

      expect(registers.fN).toBe(1);
      expect(registers.f).toBe(0b11000000);
    });
  });

  describe("fH", () => {
    test("true", () => {
      registers.f = 0b00100000;

      expect(registers.fH).toBe(1);
    });

    test("false", () => {
      registers.f = 0b01000000;

      expect(registers.fH).toBe(0);
    });

    test("set", () => {
      registers.f = 0b10000000;
      registers.fH = 1;

      expect(registers.fH).toBe(1);
      expect(registers.f).toBe(0b10100000);
    });
  });

  describe("fC", () => {
    test("true", () => {
      registers.f = 0b00010000;

      expect(registers.fC).toBe(1);
      expect(registers.fNc).toBe(0);
    });

    test("false", () => {
      registers.f = 0b01000000;

      expect(registers.fC).toBe(0);
      expect(registers.fNc).toBe(1);
    });

    test("set", () => {
      registers.f = 0b10000000;
      registers.fC = 1;

      expect(registers.fC).toBe(1);
      expect(registers.fNc).toBe(0);
      expect(registers.f).toBe(0b10010000);
    });
  });

  describe("setFFromParts", () => {
    test("booleans", () => {
      registers.setFFromParts(true, false, true, false);

      expect(registers.f).toBe(0b10100000);
    });

    test("bits", () => {
      registers.setFFromParts(0, 1, 0, 1);

      expect(registers.f).toBe(0b01010000);
    });
  });
});
