import { Mmu } from "../memory/mmu";
import {
  ByteRegister,
  FLAG_Z,
  FLAG_Z_MASK,
  GroupedWordRegister,
  Register
} from "./registers";
import { ByteValue, WordValue, byteValueToSignedByte } from "../types";
import { Cpu, Cycles } from ".";

export type LowLevelState = ByteValue | WordValue | undefined;
export type LowLevelStateReturn = ByteValue | WordValue | void;

// Read16BitOperand // loads two bytes -> takes 8 cycles
// LoadByteFromMemory // loads one byte -> takes 4 cycles
// StoreToRegister("A") // takes no extra cycles

export interface LowLevelOperation {
  readonly cycles: Cycles;
  execute(cpu: Cpu, mmu: Mmu, value: LowLevelState): LowLevelStateReturn;
}

export class LoadRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    return cpu.registers[this.register];
  }
}

export class ReadMemory implements LowLevelOperation {
  public readonly cycles: Cycles = 4;

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

export class LoadGroupedRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: GroupedWordRegister;

  public constructor(register: GroupedWordRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    return cpu.registers[this.register];
  }
}

export class WriteWordFromGroupedRegisterAddress implements LowLevelOperation {
  public readonly cycles: Cycles = 4;
  private readonly register: GroupedWordRegister;

  public constructor(register: GroupedWordRegister) {
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
  public readonly cycles: Cycles = 0;
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
  public readonly cycles: Cycles = 0;

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
  public readonly cycles: Cycles = 0;

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

export class WriteByteFromOperandAddress implements LowLevelOperation {
  public readonly cycles: Cycles = 12;

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

export class WriteWordFromOperandAddress implements LowLevelOperation {
  public readonly cycles: Cycles = 12;

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
  public readonly cycles: Cycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
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
    cpu.registers[this.register] = value & 255;
  }
}

export class StoreInGroupedRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: GroupedWordRegister;

  public constructor(register: GroupedWordRegister) {
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

export class DecrementStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 4;
  private readonly amount: WordValue;

  public constructor(amount: WordValue) {
    this.amount = amount;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.sp -= this.amount;
  }
}

export class LoadProgramCounter implements LowLevelOperation {
  public readonly cycles: Cycles = 4;

  public execute(cpu: Cpu): LowLevelStateReturn {
    return cpu.registers.pc;
  }
}

export class WriteMemoryFromOperandAddress implements LowLevelOperation {
  public readonly cycles: Cycles = 8;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    const operand = mmu.readByte(cpu.registers.pc);
    mmu.writeWordBigEndian(0xff00 + operand, value);
    cpu.registers.pc++;
  }
}

export class WriteMemoryFromRegisterAddress implements LowLevelOperation {
  public readonly cycles: Cycles = 4;
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

export class WriteMemoryFromStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 16;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value undefined");
    }
    mmu.writeWordBigEndian(cpu.registers.sp, value);
  }
}

export class StoreInStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 0;

  public execute(
    cpu: Cpu,
    mmu: Mmu,
    value: LowLevelState
  ): LowLevelStateReturn {
    if (value === undefined) {
      throw new Error("value not defined");
    }
    cpu.registers.sp = value;
  }
}

export class SetProgramCounter implements LowLevelOperation {
  public readonly cycles: Cycles = 4;
  private readonly value: WordValue;

  public constructor(value: WordValue) {
    this.value = value;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.pc = this.value;
  }
}

// TODO: Can be done in terms of lower level ops
export class LoadOperand implements LowLevelOperation {
  public readonly cycles: Cycles = 4;

  public execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn {
    const byte = mmu.readByte(cpu.registers.pc);
    cpu.registers.pc++;
    return byte;
  }
}

export class LoadWordOperand implements LowLevelOperation {
  public readonly cycles: Cycles = 8;

  public execute(cpu: Cpu, mmu: Mmu): LowLevelStateReturn {
    const byte = mmu.readBigEndianWord(cpu.registers.pc);
    cpu.registers.pc += 2;
    return byte;
  }
}

export class IncrementRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: Register;

  public constructor(register: Register) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers[this.register]++;
  }
}

export class IncrementGroupedRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: GroupedWordRegister;

  public constructor(register: GroupedWordRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers[this.register]++;
  }
}

export class XOrRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.a = cpu.registers[this.register] & 0xff;
    cpu.registers.f = cpu.registers.a ? 0x00 : 0x80;
  }
}

export class Nop implements LowLevelOperation {
  public readonly cycles: Cycles = 0;

  public execute(): LowLevelStateReturn {}
}

export class IncrementStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 4;

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers.sp++;
  }
}

export class LoadStackPointer implements LowLevelOperation {
  public readonly cycles: Cycles = 4;

  public execute(cpu: Cpu): LowLevelStateReturn {
    return cpu.registers.sp;
  }
}

export class DecrementRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers[this.register]--;
  }
}

// TODO: Depending on cycles, make this WordRegister
export class DecrementGroupedRegister implements LowLevelOperation {
  public readonly cycles: Cycles = 0;
  private readonly register: GroupedWordRegister;

  public constructor(register: GroupedWordRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    cpu.registers[this.register]--;
  }
}
