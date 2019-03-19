import { Mmu } from "../memory/mmu";
import {
  ByteRegister,
  FLAG_Z,
  FLAG_Z_MASK,
  NonAfGroupedWordRegister,
  Register
} from "./registers";
import { ByteValue, WordValue, byteValueToSignedByte } from "../types";
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

export class RotateLeft implements LowLevelOperation {
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
    let t: number = (cpu.registers[this.register] << 1) + cpu.registers.fC;
    let flag = 0x00;
    flag += (((t & 0xFF) === 0) ? 1 : 0) << cpu.registers.fZ;
    flag += (t > 0xFF ? 1 : 0) << cpu.registers.fC;
    cpu.registers.f &= 0x00;
    cpu.registers.f |= flag;
    t &= 0xFF;
    cpu.registers[this.register] = t;
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

export class WriteWordFromGroupedRegisterAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;
  private readonly register: NonAfGroupedWordRegister;

  public constructor(register: NonAfGroupedWordRegister) {
    this.register = register;
  }

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const address = cpu.registers[this.register];
    mmu.writeByte(address, value);
  }
}

export class BitFlags implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    const t = cpu.registers[this.register] & FLAG_Z_MASK;
    const flag = 0x20 + (((t & 0xff) === 0 ? 1 : 0) << FLAG_Z);
    cpu.registers.f &= 0x10;
    cpu.registers.f |= flag;
  }
}

export class JrCheck implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }

    if (cpu.registers.fNz) {
      // TODO: Becomes a longer cycle operation
      cpu.registers.pc += value;
    }
  }
}

export class WordValueToSignedByte implements LowLevelOperation {
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
    mmu.writeByte(0xff00 + operand, value & 255);
    return value;
  }
}

export class WriteMemoryFromRegisterAddress implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;
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
      throw new Error("value undefined");
    }
    mmu.writeWordBigEndian(0xff00 + cpu.registers[this.register], value);
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
    mmu.writeByte(cpu.registers.sp, value & 255);
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

// TODO: Can be done in terms of lower level ops
export class LoadOperand implements LowLevelOperation {
  public readonly cycles: ClockCycles = 4;

  public execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn {
    const byte = mmu.readByte(cpu.registers.pc);
    cpu.registers.pc++;
    return byte;
  }
}

/**
 * @deprecated should be split
 */
export class LoadWordOperand implements LowLevelOperation {
  public readonly cycles: ClockCycles = 8;

  public execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn {
    const byte = mmu.readBigEndianWord(cpu.registers.pc);
    cpu.registers.pc += 2;
    return byte;
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
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.a = cpu.registers[this.register] & 0xff;
    cpu.registers.f = cpu.registers.a ? 0x00 : 0x80;
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
