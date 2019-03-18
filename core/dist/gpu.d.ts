import { Mmu } from "./memory/mmu";
import { Screen } from "./screen";
import { ClockCycles } from "./cpu";
export declare class Gpu {
    private readonly mmu;
    private readonly screen;
    private modeCycles;
    private mode;
    constructor(mmu: Mmu, screen: Screen);
    tick(cycles: ClockCycles): void;
    private scanlineOamTick;
    private scanlineVRamTick;
    private hBlankTick;
    private vBlankTick;
}
//# sourceMappingURL=gpu.d.ts.map