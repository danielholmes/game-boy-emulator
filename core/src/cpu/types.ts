import { CpuRegisters } from "./registers";

export interface Cpu {
  readonly registers: CpuRegisters;
}

export type Cycles = number;
