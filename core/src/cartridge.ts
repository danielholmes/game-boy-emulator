import { ByteValue, MemoryAddress } from "./types";
import { isEqual, range } from "lodash";
import nintendoLogo from "./nintendoLogo";

const CARTRIDGE_LENGTH = 0x8000;
const CARTRIDGE_START_LENGTH = 0x0104;
export const CARTRIDGE_PROGRAM_START: number =
  CARTRIDGE_START_LENGTH + nintendoLogo.length;
const MAX_CARTRIDGE_PROGRAM_LENGTH: number =
  CARTRIDGE_LENGTH - CARTRIDGE_PROGRAM_START;

// TODO: ROM banks, etc
export class Cartridge {
  public readonly bytes: Uint8Array;

  public constructor(bytes: Uint8Array) {
    this.bytes = bytes;
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.bytes[address];
  }

  /* eslint-disable @typescript-eslint/no-use-before-define */
  public static builder(): CartridgeBuilder {
    return new CartridgeBuilder();
  }
  /* eslint-enable @typescript-eslint/no-use-before-define */

  public static buildWithProgram(
    program: Uint8Array | ReadonlyArray<ByteValue>
  ): Cartridge {
    return Cartridge.builder()
      .program(program)
      .build();
  }
}

class CartridgeBuilder {
  private readonly _program: Uint8Array;

  public constructor(program?: Uint8Array) {
    this._program = program || new Uint8Array(CARTRIDGE_LENGTH);
  }

  public program(
    program: Uint8Array | ReadonlyArray<ByteValue>
  ): CartridgeBuilder {
    if (program.length > MAX_CARTRIDGE_PROGRAM_LENGTH) {
      throw new Error("program too long");
    }
    return this.clone({
      program: new Uint8Array([
        ...program,
        ...range(0, MAX_CARTRIDGE_PROGRAM_LENGTH - program.length).map(
          () => 0x00
        )
      ])
    });
  }

  public build(): Cartridge {
    return new Cartridge(
      new Uint8Array([
        // empty beginning
        ...range(0x0000, CARTRIDGE_START_LENGTH).map(() => 0x00),
        // header
        ...nintendoLogo,
        ...this._program
      ])
    );
  }

  private clone({ program }: { program?: Uint8Array }): CartridgeBuilder {
    return new CartridgeBuilder(program || this._program);
  }
}

export const isValid = (cartridge: Cartridge): boolean =>
  isEqual(
    range(0x0104, 0x0133 + 1).map(address => cartridge.readByte(address)),
    nintendoLogo
  );
