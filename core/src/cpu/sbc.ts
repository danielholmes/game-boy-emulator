import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { ByteRegister } from "./registers";
import { LowLevelOperation, LowLevelStateReturn } from "./lowLevel";
import { Cpu, ClockCycles } from "./index";

class SbcAR implements LowLevelOperation {
  public readonly cycles: ClockCycles = 0;
  private readonly register: ByteRegister;

  public constructor(register: ByteRegister) {
    this.register = register;
  }

  public execute(cpu: Cpu): LowLevelStateReturn {
    const oldA = cpu.registers.a;
    cpu.registers.a -= cpu.registers[this.register];
    cpu.registers.a -= cpu.registers.f & 0x10 ? 1 : 0;
    cpu.registers.f = cpu.registers.a < 0 ? 0x50 : 0x40;
    cpu.registers.a &= 0xff;
    if (!cpu.registers.a) {
      cpu.registers.f |= 0x80;
    }
    if ((cpu.registers.a ^ cpu.registers[this.register] ^ oldA) & 0x10) {
      cpu.registers.f |= 0x20;
    }
  }
}

export const createSbcAR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `SBC a,${register}`, [new SbcAR(register)]);
