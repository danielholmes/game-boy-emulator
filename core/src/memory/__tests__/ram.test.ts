/* global describe, test, expect */

import { WorkingRam } from "../ram";

describe("ram", () => {
  describe("WorkingRam", () => {
    let ram: WorkingRam;

    beforeEach(() => {
      ram = new WorkingRam();
    });

    describe("byte", () => {
      test("success", () => {
        ram.writeByte(0x10, 0xaa);

        const result = ram.readByte(0x10);

        expect(result).toBe(0xaa);
      });
    });
  });
});
