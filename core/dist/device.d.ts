import { Gpu } from "./gpu";
import { Mmu } from "./memory/mmu";
import { Cpu } from "./cpu";
import { Cartridge } from "./cartridge";
export declare class Device {
    private readonly cpu;
    private readonly gpu;
    private readonly mmu;
    private _isOn;
    private nonUsedMs;
    constructor(cpu: Cpu, gpu: Gpu, mmu: Mmu);
    readonly isOn: boolean;
    insertCartridge(cartridge: Cartridge): void;
    removeCartridge(): void;
    turnOn(): void;
    turnOff(): void;
    tick(ms: number): void;
    tickCycle(): void;
    pressButton(button: string): void;
    releaseButton(button: string): void;
}
//# sourceMappingURL=device.d.ts.map