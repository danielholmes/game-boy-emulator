/* global describe, test, expect */

import { VRam, WorkingRam } from "../ram";

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
          0b00000000,
          0b00000000,
          0b11111111,
          0b11111111,
          0b00000000,
          0b00000000,
          0b10101010,
          0b00000000,
          0b01010101,
          0b00000000,
          0b00000000,
          0b01010101,
          0b00000000,
          0b10101010,
          0b01010101,
          0b00110011
        ].forEach((value, address) => vRam.writeByte(address, value));

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
          0b11111111,
          0b11111111,
          0b00000000,
          0b00000000,
          0b10101010,
          0b00000000,
          0b01010101,
          0b00000000,
          0b00000000,
          0b01010101,
          0b00000000,
          0b10101010,
          0b01010101,
          0b00110011,
          0b00000000,
          0b00000000
        ].forEach((value, address) =>
          vRam.writeByte(0x0800 + address + 16 * 10, value)
        );

        const tile = vRam.getTileDataFromTable2(10);

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

    describe("bgMap1", () => {
      test("normal", () => {
        [0x2e, 0xd2].forEach((value, address) =>
          vRam.writeByte(address + 0x1800, value)
        );

        const result = vRam.bgMap1;

        expect(result.length).toEqual(32);
        expect(result[0].length).toEqual(32);
        expect(result[31].length).toEqual(32);
        expect(result[0][0]).toEqual(0x2e);
        expect(result[0][1]).toEqual(0xd2);
      });
    });
  });
});
