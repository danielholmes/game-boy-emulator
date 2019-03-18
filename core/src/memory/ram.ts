import { ByteValue, MemoryAddress, numberToHex, WordValue } from "../types";

export class Ram {
  private readonly raw: ByteValue[];
  private readonly size: number;

  public constructor(size: number, raw?: ByteValue[]) {
    if (raw && raw.length > size) {
      throw new Error("bytes provided longer than size");
    }
    this.size = size;
    this.raw = raw ? raw : [];
  }

  private assertValidAddress(value: MemoryAddress): void {
    this.assertWord(value);
    if (value > this.size) {
      throw new Error("Address out of range");
    }
  }

  private assertWord(value: number): void {
    if (value < 0x0000 || value > 0xffff) {
      throw new Error(`Out of bounds word ${numberToHex(value)}`);
    }
  }

  private assertByte(value: number): void {
    if (value < 0x00 || value > 0xff) {
      throw new Error(`Out of bounds byte ${numberToHex(value)}`);
    }
  }

  public readByte(address: MemoryAddress): ByteValue {
    this.assertValidAddress(address);
    return this.raw[address];
  }

  public readWord(address: MemoryAddress): WordValue {
    this.assertValidAddress(address);
    return (this.readByte(address) << 8) + this.readByte(address + 1);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertValidAddress(address);
    this.assertByte(value);
    this.raw[address] = value;
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.assertValidAddress(address);
    this.assertWord(value);
    this.writeByte(address, value >> 8);
    this.writeByte(address + 1, value & 255);
  }

  public copy(): Ram {
    return new Ram(this.size, this.raw.slice());
  }
}

export type VRam = Ram;
export type ZeroPageRam = Ram;
