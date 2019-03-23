import { ByteRegister, NonAfGroupedWordRegister } from "./registers";
import { Instruction } from "./instructions";
export declare const createLdRR: (opCode: number, register1: ByteRegister, register2: ByteRegister) => Instruction;
export declare const createLdRrNn: (opCode: number, register: "bc" | "de" | "hl" | "sp") => Instruction;
export declare const createLdRN: (opCode: number, register: ByteRegister) => Instruction;
export declare const createLdRMRr: (opCode: number, register1: ByteRegister, register2: NonAfGroupedWordRegister) => Instruction;
export declare const createLdRHlM: (opCode: number, register: ByteRegister) => Instruction;
export declare const createLdHlMR: (opCode: number, register: ByteRegister) => Instruction;
export declare const createLdHlMN: (opCode: number) => Instruction;
export declare const createLdMFfCA: (opCode: number) => Instruction;
export declare const createLdMNA: (opCode: number) => Instruction;
export declare const createLdGrM: (opCode: number, register: NonAfGroupedWordRegister) => Instruction;
export declare const createLdAMNn: (opCode: number) => Instruction;
export declare const createLdMRA: (opCode: number, register: NonAfGroupedWordRegister) => Instruction;
export declare const createLdMNnA: (opCode: number) => Instruction;
export declare const createLdMNnSp: (opCode: number) => Instruction;
export declare const createLddMHlA: (opCode: number) => Instruction;
export declare const createLdiMHlA: (opCode: number) => Instruction;
//# sourceMappingURL=ld.d.ts.map