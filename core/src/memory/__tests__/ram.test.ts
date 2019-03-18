/* global describe, test, expect */

import { Ram } from "../ram";

describe("ram", () => {
  let ram: Ram;

  beforeEach(() => {
    ram = new Ram(0x2000);
  });

  describe("byte", () => {
    test("success", () => {
      ram.writeByte(0x10, 0xaa);

      const result = ram.readByte(0x10);

      expect(result).toBe(0xaa);
    });
  });

  describe("word", () => {
    test("success", () => {
      ram.writeWord(0x10, 0xabcd);

      const result = ram.readWord(0x10);

      expect(result).toBe(0xabcd);
    });
  });
});
