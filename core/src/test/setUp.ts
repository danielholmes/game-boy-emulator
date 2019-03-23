/* global expect */
import { createMmuSnapshot, MmuSnapshot } from "./help";
import { Mmu } from "../memory/mmu";
import { Cpu } from "../cpu";
import { CpuRegisters, Register } from "../cpu/registers";
import { toPairs } from "lodash";

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
    "setFFromParts" | "setFHFromByteAdd" | "setFHFromWordAdd" | "setFHFromByteSubtract" | "setFHFromWordSubtract"
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

    // This point is reached when the above assertion was successful.
    // The test should therefore always pass, that means it needs to be
    // `true` when used normally, and `false` when `.not` was used.
    return { pass: !this.isNot, message: "" };
  },

  toEqualCpuWithRegisters(received: Cpu, withRegisters: WithRegisters) {
    return toEqualCpuRegisters(this, received.registers, withRegisters);
  },

  toEqualCpuRegisters(received: CpuRegisters, withRegisters: WithRegisters) {
    return toEqualCpuRegisters(this, received, withRegisters);
  }
});
