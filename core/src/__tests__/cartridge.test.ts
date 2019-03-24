/* global describe, test, expect */

import { Cartridge, isValid } from "../cartridge";
import nintendoLogo from "../nintendoLogo";
import { range } from "lodash";

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
            ...range(0x0000, 0x0104).map(() => 0x00),
            ...nintendoLogo
          ]
        )
      );

      const result = isValid(cart);

      expect(result).toBe(true);
      expect(cart.readByte(0x0104)).toEqual(0xce); // first byte of logo
    });

    test("invalid (nintendo logo not where meant to be)", () => {
      const cart = new Cartridge(
        new Uint8Array(
          [
            ...range(0x0000, 0x0094).map(() => 0x00),
            ...nintendoLogo
          ]
        )
      );

      const result = isValid(cart);

      expect(result).toBe(false);
    });
  });
});
