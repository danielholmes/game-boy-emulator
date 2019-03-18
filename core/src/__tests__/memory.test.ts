/* global describe, test, expect */

import { Memory } from "../memory";
import { createMemoryWithValues } from "../test/help";

describe("memory", () => {
  let memory: Memory;

  beforeEach(() => {
    memory = new Memory();
  });

  describe("writeByte", () => {
    test("success", () => {
      memory.writeByte(0x10, 0xaa);

      expect(memory).toEqual(createMemoryWithValues({ 0x10: 0xaa }));
    });
  });

  describe("writeWord", () => {
    test("success", () => {
      memory.writeWord(0x10, 0xabcd);

      expect(memory).toEqual(
        createMemoryWithValues({ 0x10: 0xab, 0x11: 0xcd })
      );
    });
  });

  describe("byte", () => {
    test("success", () => {
      memory.writeByte(0x10, 0xaa);

      const result = memory.readByte(0x10);

      expect(result).toBe(0xaa);
    });
  });

  describe("word", () => {
    test("success", () => {
      memory.writeWord(0x10, 0xabcd);

      const result = memory.readWord(0x10);

      expect(result).toBe(0xabcd);
    });
  });
});
