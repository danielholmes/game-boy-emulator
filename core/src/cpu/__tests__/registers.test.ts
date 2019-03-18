/* global describe, test, expect */

import { createCpuRegistersWithRegisters } from "../../test/help";
import { CpuRegisters, CpuRegistersImpl } from "../registers";
import { binaryToNumber } from "../../types";

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

  describe("fZ", () => {
    test("false", () => {
      registers.f = binaryToNumber("10000000");

      expect(registers.fNz).toBe(0);
    });

    test("true", () => {
      registers.f = binaryToNumber("00100000");

      expect(registers.fNz).toBe(1);
    });
  });

  describe("fZ", () => {
    test("true", () => {
      registers.f = binaryToNumber("10000000");

      expect(registers.fZ).toBe(1);
    });

    test("false", () => {
      registers.f = binaryToNumber("00100000");

      expect(registers.fZ).toBe(0);
    });
  });

  describe("fN", () => {
    test("true", () => {
      registers.f = binaryToNumber("01000000");

      expect(registers.fN).toBe(1);
    });

    test("false", () => {
      registers.f = binaryToNumber("00100000");

      expect(registers.fN).toBe(0);
    });
  });

  describe("fH", () => {
    test("true", () => {
      registers.f = binaryToNumber("00100000");

      expect(registers.fH).toBe(1);
    });

    test("false", () => {
      registers.f = binaryToNumber("01000000");

      expect(registers.fH).toBe(0);
    });
  });

  describe("fC", () => {
    test("true", () => {
      registers.f = binaryToNumber("00010000");

      expect(registers.fC).toBe(1);
    });

    test("false", () => {
      registers.f = binaryToNumber("01000000");

      expect(registers.fC).toBe(0);
    });
  });

  describe("fNc", () => {
    test("false", () => {
      registers.f = binaryToNumber("00010000");

      expect(registers.fNc).toBe(0);
    });

    test("true", () => {
      registers.f = binaryToNumber("01000000");

      expect(registers.fNc).toBe(1);
    });
  });
});
