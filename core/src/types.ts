export type PixelColor = 0 | 1 | 2 | 3; // off (white) -> on/black

export type ColorNumber = 0 | 1 | 2 | 3;

export type ByteValue = number;
export type SignedByteValue = number;
export type WordValue = number;
export type BitValue = 1 | 0;

export type ByteBitPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const BYTE_BIT_POSITIONS: ReadonlyArray<ByteBitPosition> = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7
];

export type MemoryAddress = number;

/*export const numberToByteBinary = (value: ByteValue | WordValue): string =>
  value.toString(2).padStart(8, "0");*/

type BaseReadonlyUint8Array = Pick<
  Uint8Array,
  Exclude<
    keyof Readonly<Uint8Array>,
    "fill" | "copyWithin" | "reverse" | "set" | "sort"
  >
>;

export interface ReadonlyUint8Array extends BaseReadonlyUint8Array {
  [Symbol.iterator](): IterableIterator<number>;
}
