import { Mmu } from "../mmu";
import { createMmu } from "../../test/help";

describe("mmu", () => {
  let mmu: Mmu;

  beforeEach(() => {
    mmu = createMmu();
  });

  describe("LCDC (ff40) - LCD Control Register", () => {
    it.skip("has correct initial value", () => {
      const result = mmu.readByte(0xff40);

      expect(result).toEqual(0x91);
    });
  });
});
