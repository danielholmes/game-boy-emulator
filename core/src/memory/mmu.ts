import { ByteValue, MemoryAddress, ReadonlyUint8Array } from "../types";
import { WorkingRam, VRam, ZeroPageRam, OamMemory, ReadonlyVRam } from "./ram";
import { Bios } from "../bios";
import { Cartridge } from "../cartridge";
import { toWordHexString } from "..";

export const WORKING_RAM_RANGE: Readonly<{
  start: MemoryAddress;
  end: MemoryAddress;
}> = { start: 0xc000, end: 0xe000 };

export class Mmu {
  private readonly bios: Bios;
  private readonly workingRam: WorkingRam;
  private readonly _vRam: VRam;
  private readonly oam: OamMemory;
  private readonly zeroPage: ZeroPageRam;
  private cartridge?: Cartridge;

  public constructor(
    bios: Bios,
    ram: WorkingRam,
    vRam: VRam,
    oam: OamMemory,
    zeroPage: ZeroPageRam,
    cartridge?: Cartridge
  ) {
    this.bios = bios;
    this.workingRam = ram;
    this._vRam = vRam;
    this.oam = oam;
    this.zeroPage = zeroPage;
    this.cartridge = cartridge;
  }

  public get vRam(): ReadonlyVRam {
    return this._vRam;
  }

  public get bgP(): ByteValue {
    return this.readByte(0xff47);
  }

  public get obP0(): ByteValue {
    return this.readByte(0xff48);
  }

  public get obP1(): ByteValue {
    return this.readByte(0xff49);
  }

  public get scY(): ByteValue {
    return this.readByte(0xff42);
  }

  public get scX(): ByteValue {
    return this.readByte(0xff43);
  }

  public get workingRamValues(): ReadonlyUint8Array {
    return this.workingRam.values;
  }

  public loadCartridge(cartridge: Cartridge): void {
    this.cartridge = cartridge;
  }

  // TODO: Test access and shadowing
  public readByte(address: MemoryAddress): ByteValue {
    if (address >= 0x0000 && address <= 0x00ff && this.bios.isActive) {
      return this.bios.readByte(address);
    }
    if (address >= 0x0000 && address <= 0x7fff) {
      if (!this.cartridge) {
        return 0x00;
      }
      return this.cartridge.readByte(address);
    }
    if (address >= 0x8000 && address < 0xa000) {
      return this.vRam.readByte(address - 0x8000);
    }
    if (address >= 0xa000 && address < WORKING_RAM_RANGE.start) {
      throw new Error("TODO: Access memory on cartridge");
    }
    if (
      address >= WORKING_RAM_RANGE.start &&
      address <= WORKING_RAM_RANGE.end
    ) {
      return this.workingRam.readByte(address - WORKING_RAM_RANGE.start);
    }
    // Shadow of working ram
    if (address >= 0xe000 && address < 0xfe00) {
      return this.workingRam.readByte(address - 0xe000);
    }
    if (address >= 0xfe00 && address <= 0xfe9f) {
      return this.oam.readByte(address - 0xfe00);
    }
    if (address >= 0xfe00 && address < 0xfea0) {
      // Graphics: sprite information: Data about the sprites rendered by the graphics chip are held here, including the
      // sprites' positions and attributes.
      throw new Error("graphics mem not yet implemented");
    }
    if (address >= 0xfea0 && address <= 0xfeff) {
      // Unused space
      return 0x00;
    }
    if (address === 0xff40) {
      throw new Error("TODO: gpu control register");
      // return this.gpu.control.value;
    }
    /*
      TODO: Write tests for this:
      bit 7-1 Unimplemented: Read as 1
      bit 0 BOOT_OFF: Boot ROM lock bit
      0b1= Boot ROM is disabled and 0x0000-0x00FF works normally.
      0b0= Boot ROM is active and intercepts accesses to 0x0000-0x00FF.
     */
    if (address === 0xff50) {
      return this.bios.isActive ? 0x10000000 : 0x00000000;
    }
    if (address >= 0xff00 && address < 0xff80) {
      throw new Error("TODO: Read from io properly");
    }
    // TODO: This high ram/zero page
    if (address >= 0xff80 && address < 0xffff) {
      return this.zeroPage.readByte(address - 0xff80);
    }
    // Interrupt flags
    if (address === 0xff0f) {
      throw new Error("Interrupt flags not implemented yet");
    }
    // Interrupt enable/disable
    if (address === 0xffff) {
      throw new Error("Interrupt enable not implemented yet");
    }

    throw new Error("Address not readable");
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    if (address >= 0x8000 && address <= 0x9fff) {
      return this._vRam.writeByte(address - 0x8000, value);
    }
    if (address >= 0xa000 && address <= 0xbfff) {
      throw new Error(
        `Cannot write to ${toWordHexString(address)} which is on cartridge`
      );
    }
    if (address >= 0xc000 && address <= 0xdfff) {
      return this.workingRam.writeByte(address - 0xc000, value);
    }
    if (address >= 0xe000 && address <= 0xfdff) {
      return this.workingRam.writeByte(address - 0xe000, value);
    }
    if (address >= 0xfe00 && address <= 0xfe9f) {
      return this.oam.writeByte(address - 0xfe00, value);
    }
    if (address >= 0xff80 && address <= 0xffff) {
      return this.zeroPage.writeByte(address - 0xff80, value);
    }
    if (address >= 0xff00 && address <= 0xff7f) {
      throw new Error("TODO: Write io properly (if allowed)");
    }
    // Interrupt flags
    if (address === 0xff0f) {
      throw new Error("Interrupt flags not implemented yet");
    }
    // Interrupt enable/disable
    if (address === 0xffff) {
      throw new Error("Interrupt enable not implemented yet");
    }
    if (address >= 0xfea0 && address <= 0xfeff) {
      // Unused space, do nothing
    } else {
      throw new Error(`Can't write address ${toWordHexString(address)}`);
    }
  }
}

export type ReadonlyMmu = Pick<
  Mmu,
  "readByte" | "scX" | "scY" | "bgP" | "obP0" | "obP1"
>;
