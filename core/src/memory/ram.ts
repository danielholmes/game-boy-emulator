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

export class VRam extends Ram {
  public constructor() {
    super(0x02000);
  }
}

// https://fms.komkon.org/GameBoy/Tech/Software.html
export class IOMemory extends Ram {
  public constructor() {
    super(0x7f);
  }

  public readByte (address: MemoryAddress): ByteValue {
    return super.readByte(address)
  }

  public writeByte (address: MemoryAddress, value: ByteValue): void {
    if (address === 0x0044) {
      throw new Error('Current scan line Read-only')
    }
    super.writeByte(address, value)
  }
}
