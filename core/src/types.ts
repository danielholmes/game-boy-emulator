import { padStart } from "lodash";

export type ByteValue = number;
export type SignedByteValue = number;
export type WordValue = number;
export type BitValue = 1 | 0;

export type MemoryAddress = number;

export const byteValueToSignedByte = (value: WordValue): SignedByteValue => {
  if ((value & 0x80) !== 0) {
    return -(~value & 0xff) - 1;
  }
  return value & 0xff;
};

export const binaryToNumber = (binary: number | string): WordValue => {
  return parseInt(binary.toString(), 2);
};

const toHex = (value: number, length?: number): string => {
  const sign = value >= 0 ? "" : "-";
  const start = `${sign}0x`;
  const end = Math.abs(value)
    .toString(16)
    .toUpperCase();
  if (length === undefined) {
    return start + end;
  }
  return `${start}${padStart(end, length, "0")}`;
};

export const numberToHex = (value: number): string => toHex(value);

export const numberToByteHex = (value: ByteValue): string => toHex(value, 2);

export const numberToWordHex = (value: WordValue): string => toHex(value, 4);

export const numberToByteBinary = (value: ByteValue | WordValue): string =>
  value.toString(2).padStart(8, "0");
