import { ByteValue, SignedByteValue, WordValue } from "../types";
import { padStart, repeat } from "lodash";

export const byteValueToSignedByte = (value: WordValue): SignedByteValue => {
  if ((value & 0x80) !== 0) {
    return -(~value & 0xff) - 1;
  }
  return value & 0xff;
};

const toHex = (value: number, length?: number): string => {
  if (length !== undefined) {
    const maxValue = parseInt(repeat("f", length), 16);
    if (value > maxValue) {
      throw new Error(
        `Can't format ${value.toString(16)} in to ${length} hex digits`
      );
    }
  }
  const start = value >= 0 ? "" : "-";
  const end = Math.abs(value)
    .toString(16)
    .toLowerCase();
  if (length === undefined) {
    return start + end;
  }
  return `${start}${padStart(end, length, "0")}`;
};

export const toHexString = (value: number): string => toHex(value);

export const toByteHexString = (value: ByteValue): string => toHex(value, 2);

export const toWordHexString = (value: WordValue): string => toHex(value, 4);
