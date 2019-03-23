/* global describe, test, expect */

import { Cartridge } from "../cartridge";
import nintendoLogo from "../nintendoLogo";

describe("cartridge", () => {
  describe("Cartridge", () => {
    test("empty", () => {
      expect(() => new Cartridge(new Uint8Array())).toThrow();
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

      expect(cart.readByte(0x0004)).toEqual(0xce); // first byte of logo
    });
  });
});
