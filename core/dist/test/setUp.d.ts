import { CpuRegisters } from "../cpu/registers";
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export declare type WithRegisters = Partial<Omit<CpuRegisters, "setFFromParts">>;
export {};
//# sourceMappingURL=setUp.d.ts.map