import { ByteValue, WordValue } from "../types";
import bios from '../bios'

export type MemoryAddress = number;

export class Memory {
  private readonly raw: ByteValue[];

  public constructor(raw?: Array<ByteValue>) {
    this.raw = raw ? raw : bios.slice();
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

export class Mmu {
  private readonly memory: Memory;

  public constructor(memory: Memory) {
    this.memory = memory;
  }

  // TODO: Mmu actually defers through to the Cartridge so shouldn't load rom here
  public loadRom(rom: ReadonlyArray<ByteValue>): void {
    if (rom.length > 0x7FFF) {
      throw new Error('ROM too large')
    }
    for (let i = 0x0000; i < rom.length; i++) {
      this.memory.writeByte(i, rom[i]);
    }
  }

  private assertWritable(address: MemoryAddress): void {
    if (address < 0x8000) {
      throw new Error("Trying to write to Read only memory");
    }
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.memory.readByte(address);
  }

  public readWord(address: MemoryAddress): WordValue {
    return this.memory.readWord(address);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.assertWritable(address);
    this.memory.writeByte(address, value);
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.assertWritable(address);
    this.memory.writeWord(address, value);
  }

  // TODO: Shouldn't be using this, should be testing against underlying memory
  public copy(): Mmu {
    return new Mmu(this.memory.copy());
  }
}

// [0000-3FFF] Cartridge ROM, bank 0: The first 16,384 bytes of the cartridge program are always available at this point in the memory map. Special circumstances apply:
// [0000-00FF] BIOS: When the CPU starts up, PC starts at 0000h, which is the start of the 256-byte GameBoy BIOS code. Once the BIOS has run, it is removed from the memory map, and this area of the cartridge rom becomes addressable.
// [0100-014F] Cartridge header: This section of the cartridge contains data about its name and manufacturer, and must be written in a specific format.
// [4000-7FFF]
