/* eslint-disable */
/* global expect */
import { createMmuSnapshot, MmuSnapshot } from "./help";
import { Mmu, WORKING_RAM_RANGE } from "../memory/mmu";
import { Cpu } from "../cpu";
import { CpuRegisters, Register } from "../cpu/registers";
import {
  toPairs,
  transform,
  fromPairs
} from "lodash";
import { ByteValue, MemoryAddress } from "../types";
import { toByteHexString, toWordHexString } from "../utils/numberUtils";

const isBitRegister = (
  name: string
): name is "fZ" | "fC" | "fN" | "fH" | "fNz" | "fNc" =>
  ["fZ", "fN", "fH", "fC", "fNz", "fNc"].indexOf(name) >= 0;

// Dummy to get around typing
const isRegister = (name: string): name is Register => !!name;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type WithRegisters = Partial<
  Omit<
    CpuRegisters,
    | "setFFromParts"
    | "setFHFromByteAdd"
    | "setFHFromWordAdd"
    | "setFHFromByteSubtract"
    | "setFHFromWordSubtract"
  >
>;

const createCpuWithRegisters = (withRegisters: WithRegisters): Cpu => {
  const cpu = new Cpu();
  toPairs(withRegisters).forEach(([register, value]) => {
    if (value === undefined) {
      return;
    }
    if (isBitRegister(register)) {
      cpu.registers[register] = value ? 1 : 0;
    } else if (isRegister(register)) {
      cpu.registers[register] = value;
    }
  });
  return cpu;
};

function toEqualCpuRegisters(
  utils: { isNot: boolean },
  received: CpuRegisters,
  withRegisters: WithRegisters
): { pass: boolean; message: string | (() => string) } {
  if (received === null) {
    return {
      pass: true,
      message: () => "Mmu expected to be not null."
    };
  }

  const expected = createCpuWithRegisters(withRegisters).registers;
  if (utils.isNot) {
    expect(received).not.toEqual(expected);
  } else {
    expect(received).toEqual(expected);
  }

  // This point is reached when the above assertion was successful.
  // The test should therefore always pass, that means it needs to be
  // `true` when used normally, and `false` when `.not` was used.
  return { pass: !utils.isNot, message: "" };
}

expect.extend({
  toMatchWorkingRam(received: Mmu, expected: { [address: number]: ByteValue }) {
    if (received === null) {
      return {
        pass: true,
        message: () => "Mmu expected to be not null."
      };
    }

    const receivedInHex = fromPairs(
      [...received.workingRamValues]
        .map<Readonly<[MemoryAddress, ByteValue]>>((v, i) => [i, v])
        .filter(([, value]) => value !== 0x00)
        .map(([address, value]) => [
          toWordHexString(address + WORKING_RAM_RANGE.start),
          toByteHexString(value)
        ])
    );
    const expectedInHex = transform<ByteValue, string>(
      expected,
      (result, value, address) => {
        result[toWordHexString(parseInt(address))] = toByteHexString(value);
      }
    );
    if (this.isNot) {
      expect(receivedInHex).not.toEqual(expectedInHex);
    } else {
      expect(receivedInHex).toEqual(expectedInHex);
    }

    return { pass: !this.isNot, message: "" };
  },

  toMatchSnapshotWorkingRam(received: Mmu, snapshot: MmuSnapshot) {
    if (received === null) {
      return {
        pass: true,
        message: () => "Mmu expected to be not null."
      };
    }

    const receivedSnapshot = createMmuSnapshot(received);
    if (this.isNot) {
      expect(receivedSnapshot.workingRamValues).not.toEqual(
        snapshot.workingRamValues
      );
    } else {
      expect(receivedSnapshot.workingRamValues).toEqual(
        snapshot.workingRamValues
      );
    }

    return { pass: !this.isNot, message: "" };
  },

  toEqualCpuWithRegisters(received: Cpu, withRegisters: WithRegisters) {
    return toEqualCpuRegisters(this, received.registers, withRegisters);
  },

  toEqualCpuRegisters(received: CpuRegisters, withRegisters: WithRegisters) {
    return toEqualCpuRegisters(this, received, withRegisters);
  }
});
