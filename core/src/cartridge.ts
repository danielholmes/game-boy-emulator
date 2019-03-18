import { ByteValue, MemoryAddress } from "./types";

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
