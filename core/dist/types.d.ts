export declare type ByteValue = number;
export declare type SignedByteValue = number;
export declare type WordValue = number;
export declare type BitValue = 1 | 0;
export declare type ByteBitPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare const BYTE_BIT_POSITIONS: ReadonlyArray<ByteBitPosition>;
export declare type MemoryAddress = number;
export declare const byteValueToSignedByte: (value: number) => number;
export declare const binaryToNumber: (binary: string | number) => number;
export declare const numberToHex: (value: number) => string;
export declare const numberToByteHex: (value: number) => string;
export declare const numberToWordHex: (value: number) => string;
export declare const numberToByteBinary: (value: number) => string;
//# sourceMappingURL=types.d.ts.map