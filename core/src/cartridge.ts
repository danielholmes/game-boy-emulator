import { ByteValue, MemoryAddress } from "./types";
import { isEqual } from "lodash";
import nintendoLogo from './nintendoLogo';

// TODO: ROM banks, etc
export class Cartridge {
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
}
