import { Instruction } from "./instructions";
import { ByteBitPosition } from "../types";
import { ByteRegister } from "./registers";
export declare const createCb: (opCode: number) => Instruction;
export declare const createCbBitBR: (opCode: number, position: ByteBitPosition, register: ByteRegister) => Instruction;
export declare const createCbBitBMHl: (opCode: number, position: ByteBitPosition) => Instruction;
//# sourceMappingURL=cb.d.ts.map