import { ByteValue, MemoryAddress } from "./types";
import { isEqual } from "lodash";
import nintendoLogo from './nintendoLogo';

// TODO: ROM banks, etc
export class Cartridge {
  public static readonly PC_START: MemoryAddress = 4 + nintendoLogo.length;
  public readonly bytes: Uint8Array;

  public constructor(bytes: Uint8Array) {
    // TODO: Should allow this, this check should be somewhere else, not sure where
    if (!isEqual([...bytes.slice(0x0004, 0x0033 + 1)], nintendoLogo)) {
      throw new Error("invalid rom");
    }
    this.bytes = bytes;
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.bytes[address];
  }

  public static newWithNintendoLogo(bytes: Uint8Array): Cartridge {
    return new Cartridge(
      new Uint8Array([
        0x00, // 0x0100
        0x00, // 0x0101
        0x00, // 0x0102
        0x00, // 0x0103
        ...nintendoLogo,
        ...bytes
      ])
    );
  }
}
