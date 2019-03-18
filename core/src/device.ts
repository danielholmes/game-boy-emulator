import { Gpu } from './gpu'
import { Cpu } from './cpu/types'
import { Mmu } from './memory/mmu'
import { Cartridge } from './cartridge'

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
}