import { ByteValue, MemoryAddress, numberToWordHex, WordValue } from "../types";
import { WorkingRam, VRam, ZeroPageRam } from "./ram";
import { Bios } from "../bios";

export class Mmu {
  private readonly bios: Bios;
  private readonly workingRam: WorkingRam;
  private readonly vRam: VRam;
  private readonly zeroPage: ZeroPageRam;
  private cartridge?: ReadonlyArray<ByteValue>;

  public constructor(
    bios: Bios,
    ram: WorkingRam,
    vRam: VRam,
    zeroPage: ZeroPageRam
  ) {
    this.bios = bios;
    this.workingRam = ram;
    this.vRam = vRam;
    this.zeroPage = zeroPage;
  }

  public loadCartridge(cartridge: ReadonlyArray<ByteValue>): void {
    if (cartridge.length > 0x7fff) {
      throw new Error("Cartridge too large");
    }
    this.cartridge = cartridge;
  }

  // TODO: Test access and shadowing
  public readByte(address: MemoryAddress): ByteValue {
    // TODO: Once the bios has run, it is removed and goes through to cartridge
    if (address >= 0x0000 && address <= 0x00ff && !this.cartridge) {
      return this.bios.readByte(address);
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
      return this.workingRam.readByte(address - 0xc000);
    }
    if (address >= 0xa000 && address <= 0xbfff) {
      throw new Error("TODO: Access memory on cartridge");
    }
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.workingRam.readByte(address - 0xe000);
    }
    if (address >= 0xff80 && address <= 0xffff) {
      return this.zeroPage.readByte(address - 0xff80);
    }
    if (address >= 0xfe00 && address <= 0xfe9f) {
      // Graphics: sprite information: Data about the sprites rendered by the graphics chip are held here, including the
      // sprites' positions and attributes.
      throw new Error("graphics mem not yet implemented");
    }
    if (address >= 0xff00 && address <= 0xff7f) {
      throw new Error("TODO: Memory-mapped I/O");
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
      return this.workingRam.writeByte(address - 0xc000, value);
    }
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.workingRam.writeByte(address - 0xe000, value);
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
}

// [0000-3FFF] Cartridge ROM, bank 0: The first 16,384 bytes of the cartridge program are always available at this point in the memory map. Special circumstances apply:
// [0000-00FF] BIOS: When the CPU starts up, PC starts at 0000h, which is the start of the 256-byte GameBoy BIOS code. Once the BIOS has run, it is removed from the memory map, and this area of the cartridge rom becomes addressable.
// [0100-014F] Cartridge header: This section of the cartridge contains data about its name and manufacturer, and must be written in a specific format.
// [4000-7FFF]
