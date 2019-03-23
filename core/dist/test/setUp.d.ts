import { CpuRegisters } from "../cpu/registers";
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type WithRegisters = Partial<Omit<CpuRegisters, "setFFromParts" | "setFHFromByteAdd" | "setFHFromWordAdd" | "setFHFromByteSubtract" | "setFHFromWordSubtract">>;
export {};
//# sourceMappingURL=setUp.d.ts.map