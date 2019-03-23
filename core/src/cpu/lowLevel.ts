import { Mmu } from "../memory/mmu";
import {
  ByteRegister,
  FLAG_C_MASK,
  FLAG_Z_BIT,
  FLAG_Z_MASK,
  NonAfGroupedWordRegister,
  Register
} from "./registers";
import {
  ByteValue,
  WordValue,
  byteValueToSignedByte,
  BitValue
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
    const flag = 0x20 + (((t & 0xff) === 0 ? 1 : 0) << FLAG_Z_BIT);
    cpu.registers.f &= 0x10;
    cpu.registers.f |= flag;
  }
}

export type JrFlag = 'fNz' | 'fZ' | 'fC' | 'fNc';
export const JR_FLAGS: ReadonlyArray<JrFlag> = ['fNz', 'fZ', 'fC', 'fNc'];

export class JrCheck implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly flag: JrFlag;

  public constructor(flag: JrFlag) {
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

    if (this.flag) {
      // TODO: Becomes a longer cycle operation, in internal
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
