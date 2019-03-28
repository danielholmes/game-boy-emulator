import { Gpu } from "./gpu";
import { Mmu, ReadonlyMmu } from "./memory/mmu";
import { Cpu } from "./cpu";
import { Cartridge } from "./cartridge";
import { ReadonlyVRam } from "./memory/ram";
export declare class Device {
    readonly cpu: Cpu;
    private readonly gpu;
    private readonly _mmu;
    private _isOn;
    private nonUsedMs;
    constructor(cpu: Cpu, gpu: Gpu, mmu: Mmu);
    readonly vRam: ReadonlyVRam;
    readonly mmu: ReadonlyMmu;
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