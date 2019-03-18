import { Gpu } from "./gpu";
import { Mmu } from "./memory/mmu";
import { Cartridge } from "./cartridge";
import { Cpu } from "./cpu";

// TODO: Insert some polumorphic timer hardware that pushes the clock along
export class Device {
  private readonly cpu: Cpu;
  private readonly gpu: Gpu;
  private readonly mmu: Mmu;
  private cartridge?: Cartridge;

  public constructor(cpu: Cpu, gpu: Gpu, mmu: Mmu) {
    this.cpu = cpu;
    this.gpu = gpu;
    this.mmu = mmu;
  }

  public tick(): void {
    this.cpu.tick(this.mmu);
    this.gpu.tick();
    // TODO: Interrupts
  }
}
