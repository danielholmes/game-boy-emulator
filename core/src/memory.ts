import { ByteValue, WordValue } from "./types";

export type MemoryAddress = number;

export class Memory {
  private readonly raw: ByteValue[];

  public constructor(raw?: ByteValue[]) {
    this.raw = raw ? raw : [];
    // range(0, 0xFFFF).map(constant(0x00))
  }

  private assertWord(value: MemoryAddress): void {
    if (value < 0x0000 || value > 0xffff) {
      throw new Error("Out of bounds word");
    }
  }

  private assertByte(value: MemoryAddress): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error("Out of bounds byte");
    }
  }

  public readByte(address: MemoryAddress): ByteValue {
    this.assertWord(address);
    return this.raw[address];
  }

  public readWord(address: MemoryAddress): WordValue {
    this.assertWord(address);
    return (this.readByte(address) << 8) + this.readByte(address + 1);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertWord(address);
    this.assertByte(value);
    this.raw[address] = value;
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.assertWord(address);
    this.assertWord(value);
    this.writeByte(address, value >> 8);
    this.writeByte(address + 1, value & 255);
  }

  public copy(): Memory {
    return new Memory(this.raw.slice());
  }
}
