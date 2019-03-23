import { Instruction } from "./instructions";
import { ByteRegister } from "./registers";
export declare const createIncRr: (opCode: number, register: "bc" | "de" | "hl" | "sp") => Instruction;
export declare const createIncR: (opCode: number, register: ByteRegister) => Instruction;
//# sourceMappingURL=inc.d.ts.map