import {
  ByteValue,
  MemoryAddress,
  numberToHex,
  numberToWordHex
} from "../types";

class Ram {
  protected readonly raw: Uint8Array;
  private readonly size: number;

  public constructor(size: number) {
    this.size = size;
    this.raw = new Uint8Array(this.size);
  }

  public getValues(): Uint8Array {
    return this.raw.slice();
  }

  private assertValidAddress(value: MemoryAddress): void {
    if (value < 0x0000 || value >= this.size) {
      throw new Error(
        `Address ${numberToWordHex(value)} out of range ${numberToWordHex(
          this.size
        )}`
      );
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

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertValidAddress(address);
    this.assertByte(value);
    this.raw[address] = value;
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

export const V_RAM_SIZE = 0x2000;

export class VRam extends Ram {
  public constructor() {
    super(V_RAM_SIZE);
  }

  public static initializeRandomly(): VRam {
    const vRam = new VRam();
    for (let i = 0; i < V_RAM_SIZE; i++) {
      vRam.writeByte(i, Math.round(Math.random() * 0xff));
    }
    return vRam;
  }
}

export class OamMemory extends Ram {
  public constructor() {
    super(0xa0);
  }
}

// https://fms.komkon.org/GameBoy/Tech/Software.html
export class IOMemory extends Ram {
  public constructor() {
    super(0x7f);
  }

  public readByte(address: MemoryAddress): ByteValue {
    return super.readByte(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    // bios seems to use it
    // if (address === 0x0044) {
    //   throw new Error("Current scan line Read-only");
    // }
    super.writeByte(address, value);
  }
}
