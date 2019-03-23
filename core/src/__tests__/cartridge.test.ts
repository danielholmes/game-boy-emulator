/* global describe, test, expect */

import { Cartridge, isValid } from "../cartridge";
import nintendoLogo from "../nintendoLogo";

describe("cartridge", () => {
  describe("isValid", () => {
    test("empty", () => {
      const cart = new Cartridge(new Uint8Array());

      const result = isValid(cart);

      expect(result).toBe(false);
    });

    test("valid", () => {
      const cart = new Cartridge(
        new Uint8Array(
          [
            0x00, // 0x0100
            0x00, // 0x0101
            0x00, // 0x0102
            0x00, // 0x0103
            ...nintendoLogo
          ]
        )
      );

      const result = isValid(cart);

      expect(result).toBe(true);
      expect(cart.readByte(0x0004)).toEqual(0xce); // first byte of logo
    });
  });
});
