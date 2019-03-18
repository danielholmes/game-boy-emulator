import { Instruction } from "./instructions";
export declare type RstAddress = 0x0000 | 0x0008 | 0x0010 | 0x0018 | 0x0020 | 0x0028 | 0x0030 | 0x0038;
export declare const RST_ADDRESSES: ReadonlyArray<RstAddress>;
export declare const createRst: (opCode: number, address: RstAddress) => Instruction;
//# sourceMappingURL=rst.d.ts.map