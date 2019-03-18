import { ByteValue, MemoryAddress, numberToHex, WordValue } from "../types";

class Ram {
  protected readonly raw: ByteValue[];
  private readonly size: number;

  public constructor(size: number) {
    this.size = size;
    this.raw = [];
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
}

export class ZeroPageRam extends Ram {
  public constructor() {
    super(0xff);
  }
}

export class WorkingRam extends Ram {
  public constructor() {
    super(0x2000);
  }
}

export class VRam {
  private readonly ram: Ram;

  public constructor() {
    this.ram = new Ram(0x02000);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.ram.readByte(address);
  }

  public readWord(address: MemoryAddress): WordValue {
    return this.ram.readWord(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.ram.writeByte(address, value);
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.ram.writeWord(address, value);
  }
}
