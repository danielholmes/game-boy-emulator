/* global describe, test, expect */

import { VRam, WorkingRam } from "../ram";
import { binaryToNumber } from "../../types";

describe("ram", () => {
  describe("WorkingRam", () => {
    let workingRam: WorkingRam;

    beforeEach(() => {
      workingRam = new WorkingRam();
    });

    describe("byte", () => {
      test("success", () => {
        workingRam.writeByte(0x10, 0xaa);

        const result = workingRam.readByte(0x10);

        expect(result).toBe(0xaa);
      });
    });
  });

  describe("VRam", () => {
    let vRam: VRam;

    beforeEach(() => {
      vRam = new VRam();
    });

    describe("getTileDataFromTable1", () => {
      test("mixed data at origin", () => {
        [
          "00000000",
          "00000000",
          "11111111",
          "11111111",
          "00000000",
          "00000000",
          "10101010",
          "00000000",
          "01010101",
          "00000000",
          "00000000",
          "01010101",
          "00000000",
          "10101010",
          "01010101",
          "00110011"
        ].forEach((value, address) =>
          vRam.writeByte(address, binaryToNumber(value))
        );

        const tile = vRam.getTileDataFromTable1(0);

        expect(tile).toEqual([
          [0, 0, 0, 0, 0, 0, 0, 0],
          [3, 3, 3, 3, 3, 3, 3, 3],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 1, 2, 3, 0, 1, 2, 3]
        ]);
      });

      test("too large address", () => {
        expect(() => vRam.getTileDataFromTable1(256)).toThrow();
      });

      test("too small address", () => {
        expect(() => vRam.getTileDataFromTable1(-1)).toThrow();
      });
    });

    describe("getTileDataFromTable2", () => {
      test("mixed data in middle", () => {
        [
          "11111111",
          "11111111",
          "00000000",
          "00000000",
          "10101010",
          "00000000",
          "01010101",
          "00000000",
          "00000000",
          "01010101",
          "00000000",
          "10101010",
          "01010101",
          "00110011",
          "00000000",
          "00000000"
        ].forEach((value, address) =>
          vRam.writeByte(0x0800 + address + 16 * 0, binaryToNumber(value))
        );

        const tile = vRam.getTileDataFromTable2(0);

        expect(tile).toEqual([
          [3, 3, 3, 3, 3, 3, 3, 3],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 1, 2, 3, 0, 1, 2, 3],
          [0, 0, 0, 0, 0, 0, 0, 0]
        ]);
      });

      test("too large address", () => {
        expect(() => vRam.getTileDataFromTable2(256)).toThrow();
      });

      test("too small address", () => {
        expect(() => vRam.getTileDataFromTable2(-1)).toThrow();
      });
    });
  });
});
