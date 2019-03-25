import { Mmu } from "../memory/mmu";
import { OpCode } from "./instructions";
import { CpuRegisters, CpuRegistersImpl } from "./registers";
import opCodesMap from "./opCodesMap";
import { toByteHexString } from "../utils/numberUtils";

export type ClockCycles = number;

// const CLOCK_CYCLES_PER_MACHINE_CYCLE = 4;

export class Cpu {
  public readonly registers: CpuRegisters;
  // Temporary variable until refactor done
  private remainingCycles: ClockCycles;

  public constructor() {
    this.registers = new CpuRegistersImpl();
    this.remainingCycles = 0;
  }

  public getInstructionLabel(opCode: OpCode): string {
    const instruction = opCodesMap[opCode];
    if (!instruction) {
      throw new Error(`No instruction with opCode ${toByteHexString(opCode)}`);
    }
    return instruction.label;
  }

  // TODO: See device comments for changes
  public tick(mmu: Mmu, cycles: ClockCycles): void {
    this.remainingCycles += cycles;

    // Note: that this currently goes below 0 which is a no no. Should only
    // simulate up to current available cycles. This will be achieved when all
    // instructions are specified in 4 cycle chunks
    while (this.remainingCycles > 4) {
      this.tickCycle(mmu);
    }
  }

  public tickCycle(mmu: Mmu): void {
    // TODO: Convert to low level
    const opCode = mmu.readByte(this.registers.pc);
    this.remainingCycles -= 4;

    const instruction = opCodesMap[opCode];
    if (!instruction) {
      throw new Error(
        `No instruction for opCode ${toByteHexString(
          opCode
        )} reading from pc ${toByteHexString(this.registers.pc)}`
      );
    }
    this.registers.pc++;

    this.remainingCycles -= instruction.execute(this, mmu);

    // detect interrupt
    // Remembers its current state;
    // I Jumps (sets the PC) to the address of the interrupt handler.
    //   I Executes the interrupt handler code, which ends with a special
    // RETI (Return From Interrupt) instruction, which restores state.

    // I If multiple interrupts are detected, the one with the highest
    // priority is handled first.

    // The processor also has an Interrupt Master Enable (IME) switch,
    // which allows it to completely deactivate interrupt handling
    // (this is done during e.g. processing an interrupt, because we
    // should not handle two of them at the same time).
  }
}
