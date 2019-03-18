import { Gpu } from "./gpu";
import { Mmu } from "./memory/mmu";
import { Cpu } from "./cpu";

// TODO: Insert some polumorphic timer hardware that pushes the clock along
export class Device {
  private readonly cpu: Cpu;
  private readonly gpu: Gpu;
  private readonly mmu: Mmu;

  public constructor(cpu: Cpu, gpu: Gpu, mmu: Mmu) {
    this.cpu = cpu;
    this.gpu = gpu;
    this.mmu = mmu;
  }

  public tick(): void {
    const cycles = this.cpu.tick(this.mmu);
    this.gpu.tick(cycles);
    // TODO: Interrupts
  }
}
