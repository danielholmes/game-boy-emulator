import { ByteValue, numberToWordHex, WordValue } from "../types";
import { Ram, VRam, ZeroPageRam } from "./ram";
import bios from "../bios";

export type MemoryAddress = number;

export class Mmu {
  private readonly ram: Ram;
  private readonly vRam: VRam;
  private readonly zeroPage: ZeroPageRam;
  private cartridge?: ReadonlyArray<ByteValue>;

  public constructor(ram: Ram, vRam: VRam, zeroPage: ZeroPageRam) {
    this.ram = ram;
    this.vRam = vRam;
    this.zeroPage = zeroPage;
  }

  public loadCartridge(cartridge: ReadonlyArray<ByteValue>): void {
    if (cartridge.length > 0x7fff) {
      throw new Error("ROM too large");
    }
    this.cartridge = cartridge;
  }

  // TODO: Test access and shadowing
  public readByte(address: MemoryAddress): ByteValue {
    // TODO: Once the bios has run, it is removed and goes through to cartridge
    if (address >= 0x0000 && address <= 0x00ff && !this.cartridge) {
      return bios[address];
    }
    if (address >= 0x0000 && address <= 0x7fff) {
      if (!this.cartridge) {
        throw new Error("No cartridge");
      }
      return this.cartridge[address];
    }
    if (address >= 0x8000 && address <= 0x9fff) {
      return this.vRam.readByte(address - 0x8000);
    }
    if (address >= 0xc000 && address <= 0xdfff) {
      return this.ram.readByte(address - 0xc000);
    }
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.ram.readByte(address - 0xe000);
    }
    if (address >= 0xff80 && address <= 0xffff) {
      return this.zeroPage.readByte(address - 0xff80);
    }

    throw new Error("Address not readable");
  }

  public readWord(address: MemoryAddress): WordValue {
    return (this.readByte(address) << 8) + this.readByte(address + 1);
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    if (address >= 0x8000 && address <= 0x9fff) {
      return this.vRam.writeByte(address - 0x8000, value);
    }
    if (address >= 0xc000 && address <= 0xdfff) {
      return this.ram.writeByte(address - 0xc000, value);
    }
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.ram.writeByte(address - 0xe000, value);
    }
    if (address >= 0xff80 && address <= 0xffff) {
      return this.zeroPage.writeByte(address - 0xff80, value);
    }

    throw new Error(`Can't write address ${numberToWordHex(address)}`);
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.writeByte(address, value >> 8);
    this.writeByte(address + 1, value & 255);
  }

  // TODO: Shouldn't be using this, should be testing against underlying memory
  public copy(): Mmu {
    const mmu = new Mmu(
      this.ram.copy(),
      this.vRam.copy(),
      this.zeroPage.copy()
    );
    if (this.cartridge) {
      mmu.loadCartridge(this.cartridge.slice());
    }
    return mmu;
  }
}

// [0000-3FFF] Cartridge ROM, bank 0: The first 16,384 bytes of the cartridge program are always available at this point in the memory map. Special circumstances apply:
// [0000-00FF] BIOS: When the CPU starts up, PC starts at 0000h, which is the start of the 256-byte GameBoy BIOS code. Once the BIOS has run, it is removed from the memory map, and this area of the cartridge rom becomes addressable.
// [0100-014F] Cartridge header: This section of the cartridge contains data about its name and manufacturer, and must be written in a specific format.
// [4000-7FFF]
