import { Instruction } from "./instructions";
import { ByteRegister } from "./registers";
export declare const createDecR: (opCode: number, register: ByteRegister) => Instruction;
export declare type DecRrRegister = "bc" | "de" | "hl" | "sp";
export declare const createDecRr: (opCode: number, register: "bc" | "de" | "hl" | "sp") => Instruction;
//# sourceMappingURL=dec.d.ts.map