import { Mmu } from "../memory/mmu";
import {
  ByteRegister, calculateFHFromByteAdd,
  FLAG_C_MASK,
  FLAG_Z_MASK,
  Register,
  WordRegister
} from "./registers";
import {
  ByteValue,
  WordValue,
  byteValueToSignedByte,
  BitValue,
  ByteBitPosition,
  binaryToNumber, numberToWordHex, numberToByteHex
} from "../types";
import { Cpu, ClockCycles } from ".";

export type LowLevelState = ByteValue | WordValue | undefined;
export type LowLevelStateReturn = ByteValue | WordValue | void;

// Read16BitOperand // loads two bytes -> takes 8 cycles
// LoadByteFromMemory // loads one byte -> takes 4 cycles
// StoreToRegister("A") // takes no extra cycles

// TODO: Make all 0 or 4 cycles
// TODO: Work on the fZ case which has different cycles depending on flag -
//  might need to return cycles used

export interface LowLevelOperation {
  readonly cycles: ClockCycles;
  execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}

export class LoadRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    return cpu.registers[this.register];
  }
}

export class CompareToRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("Undefined value");
    }
    const previous = cpu.registers[this.register];
    const next = previous - value;
    cpu.registers.setFFromParts(
      next === 0x00,
      1,
      (previous & 0xf) - (value & 0xf) < 0,
      next < 0
    );
    return next;
  }
}

export class RotateLeftThroughCarry implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    const newFC: BitValue =
      (cpu.registers[this.register] & (1 << 7)) !== 0 ? 1 : 0;
    const newValue = (cpu.registers[this.register] << 1) + cpu.registers.fC;
    cpu.registers[this.register] = newValue;
    let newF = 0x00;
    if (newFC === 1) {
      newF |= FLAG_C_MASK;
    } else {
      newF &= ~FLAG_C_MASK;
    }
    if (newValue === 0) {
      newF |= FLAG_Z_MASK;
    }
    cpu.registers.f = newF;
  }
}

export class ReadMemoryWord implements LowLevelOperation {
  public readonly cycles: ClockCycles = 8;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    return mmu.readBigEndianWord(value);
  }
}

export class ReadMemory implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    return mmu.readByte(value);
  }
}

export class BitFlags implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly position: ByteBitPosition;

  public constructor(position: ByteBitPosition) {
    this.position = position;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const bit = value & (1 << this.position);
    cpu.registers.fZ = bit === 0 ? 1 : 0;
    cpu.registers.fN = 0;
    cpu.registers.fH = 1;
  }
}

export type CheckFlag = "fNz" | "fZ" | "fC" | "fNc";
export const CHECK_FLAGS: ReadonlyArray<CheckFlag> = ["fNz", "fZ", "fC", "fNc"];

export class SetToPcIfFlag implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly flag: CheckFlag;

  public constructor(flag: CheckFlag) {
    this.flag = flag;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }

    if (cpu.registers[this.flag]) {
      cpu.registers.pc = value;
    }
  }
}

export class AddToPcIfFlag implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly flag: CheckFlag;

  public constructor(flag: CheckFlag) {
    this.flag = flag;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }

    if (cpu.registers[this.flag]) {
      cpu.registers.pc += value;
    }
  }
}

export class ByteValueToSignedByte implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }

    return byteValueToSignedByte(value);
  }
}

/**
 * @deprecated should be split
 */
export class WriteByteFromOperandAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 12;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const address = mmu.readBigEndianWord(cpu.registers.pc);
    mmu.writeByte(address, value);
    cpu.registers.pc += 2;
  }
}

/**
 * @deprecated should be split
 */
export class WriteWordFromOperandAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 16;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const address = mmu.readBigEndianWord(cpu.registers.pc);
    mmu.writeWordBigEndian(address, value);
    cpu.registers.pc += 2;
  }
}

export class AddToRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value not defined");
    }
    cpu.registers[this.register] += value;
  }
}

export class StoreInRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value not defined");
    }
    cpu.registers[this.register] = value;
  }
}

export class WriteMemoryHighByteFromOperandAddress
  implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const operand = mmu.readByte(cpu.registers.pc);
    mmu.writeByte(0xff00 + operand + 1, value >> 8);
    return value;
  }
}

export class WriteMemoryLowByteFromOperandAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const operand = mmu.readByte(cpu.registers.pc);
    mmu.writeByte(0xff00 + operand, value & 0xff);
    return value;
  }
}

export class WriteMemoryFromRegisterAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;
  private readonly register: Register;
  private readonly add: WordValue;

  public constructor(register: Register, add: WordValue = 0x0000) {
    this.register = register;
    this.add = add;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    mmu.writeByte(cpu.registers[this.register] + this.add, value);
  }
}

export class InternalDelay implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    return value;
  }
}

export class WriteMemoryWordHighByteFromStackPointer
implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    mmu.writeByte(cpu.registers.sp + 1, value >> 8);
    return value;
  }
}

export class WriteMemoryWordLowByteFromStackPointer
implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    mmu.writeByte(cpu.registers.sp, value & 0xff);
    return value;
  }
}

export class SetRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;
  private readonly value: WordValue;

  public constructor(register: Register, value: WordValue) {
    this.register = register;
    this.value = value;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers[this.register] = this.value;
  }
}

export class AddWithCarryToA implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const result = cpu.registers.a + value + cpu.registers.fC;
    cpu.registers.setFFromParts(
      result === 0x100 ? 1 : 0,
    0,
      calculateFHFromByteAdd(cpu.registers.a, value + cpu.registers.fC),
    result > 0xff ? 1 : 0
    );
    cpu.registers.a = result;
  }
}

export class AddToValue implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly amount: WordValue | ByteValue;

  public constructor(amount: WordValue | ByteValue) {
    this.amount = amount;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    return value + this.amount;
  }
}

export class LoadOperand implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn {
    const byte = mmu.readByte(cpu.registers.pc);
    cpu.registers.pc++;
    return byte;
  }
}

export class LoadWordOperandHighByte implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const byte = mmu.readByte(cpu.registers.pc);
    cpu.registers.pc++;
    return (byte << 8) + value;
  }
}

export class IncrementWordRegisterWithFlags implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: WordRegister;

  public constructor(register: WordRegister) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    cpu.registers.setFHFromWordAdd(cpu.registers[this.register], 1);
    cpu.registers[this.register]++;
    cpu.registers.fZ = cpu.registers[this.register] === 0x0000 ? 1 : 0;
    cpu.registers.fN = 0;
    return value;
  }
}

export class IncrementByteRegisterWithFlags implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    cpu.registers.setFHFromByteAdd(cpu.registers[this.register], 1);
    cpu.registers[this.register]++;
    cpu.registers.fZ = cpu.registers[this.register] === 0x00 ? 1 : 0;
    cpu.registers.fN = 0;
    return value;
  }
}

export class IncrementRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    cpu.registers[this.register]++;
    return value;
  }
}

export class XOrRegister implements LowLevelOperation {
  private static readonly F_Z_SET: number = binaryToNumber("10000000");
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.a ^= cpu.registers[this.register];
    cpu.registers.f = cpu.registers.a ? 0x00 : XOrRegister.F_Z_SET;
  }
}

export class DecrementByteRegisterWithFlags implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    cpu.registers.setFHFromByteSubtract(cpu.registers[this.register], 1);
    cpu.registers[this.register]--;
    cpu.registers.fZ = cpu.registers[this.register] === 0x00 ? 1 : 0;
    cpu.registers.fN = 1;
    return value;
  }
}

export class DecrementRegister implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    cpu.registers[this.register]--;
    return value;
  }
}
