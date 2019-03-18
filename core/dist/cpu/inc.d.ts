import { Instruction } from "./instructions";
import { GroupedWordRegister, Register } from "./registers";
export declare const createIncRr: (opCode: number, register: GroupedWordRegister) => Instruction;
export declare const createIncR: (opCode: number, register: Register) => Instruction;
export declare const createIncSp: (opCode: number) => Instruction;
//# sourceMappingURL=inc.d.ts.map