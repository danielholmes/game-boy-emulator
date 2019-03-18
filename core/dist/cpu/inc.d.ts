import { Instruction } from "./instructions";
import { NonAfGroupedWordRegister, Register } from "./registers";
export declare const createIncRr: (opCode: number, register: NonAfGroupedWordRegister) => Instruction;
export declare const createIncR: (opCode: number, register: Register) => Instruction;
export declare const createIncSp: (opCode: number) => Instruction;
//# sourceMappingURL=inc.d.ts.map