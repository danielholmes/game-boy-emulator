import { ByteValue, MemoryAddress } from "./types";
import { isEqual, range } from "lodash";
import nintendoLogo from "./nintendoLogo";

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

export const isValid = (cartridge: Cartridge): Boolean =>
  isEqual(
    range(0x0104, 0x0133 + 1)
      .map((address) => cartridge.readByte(address)),
    nintendoLogo
  );

export class CartridgeBuilder {
  private readonly _program: Uint8Array;

  private constructor(program?: Uint8Array)
  {
    this._program = program || new Uint8Array();
  }

  public program(program: Uint8Array | ReadonlyArray<ByteValue>): CartridgeBuilder {
    return this.clone({ program: new Uint8Array(program) });
  }

  public build(): Cartridge {
    return new Cartridge(
      new Uint8Array([
        // header
        ...range(0x0000, 0x0104).map(() => 0x00),
        // nintendo logo
        ...nintendoLogo,
        ...this._program
      ])
    )
  }

  private clone({ program }: { program?: Uint8Array }): CartridgeBuilder {
    return new CartridgeBuilder(program || this._program);
  }

  public static builder(): CartridgeBuilder {
    return new CartridgeBuilder();
  }
}
