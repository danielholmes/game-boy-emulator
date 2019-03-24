import { ByteValue, MemoryAddress } from "./types";
import { isEqual, range } from "lodash";
import nintendoLogo from "./nintendoLogo";

// TODO: ROM banks, etc
export class Cartridge {
  public readonly bytes: Uint8Array;

  public constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.bytes[address];
  }
}

export const isValid = (cartridge: Cartridge): Boolean =>
  isEqual(
    range(0x0104, 0x0133 + 1)
      .map((address) => cartridge.readByte(address)),
    nintendoLogo
  )
