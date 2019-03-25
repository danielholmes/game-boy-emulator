export declare type PixelColor = 0 | 1 | 2 | 3;
export declare type ColorNumber = 0 | 1 | 2 | 3;
export declare type ByteValue = number;
export declare type SignedByteValue = number;
export declare type WordValue = number;
export declare type BitValue = 1 | 0;
export declare type ByteBitPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare const BYTE_BIT_POSITIONS: ReadonlyArray<ByteBitPosition>;
export declare type MemoryAddress = number;
declare type BaseReadonlyUint8Array = Pick<Uint8Array, Exclude<keyof Readonly<Uint8Array>, "fill" | "copyWithin" | "reverse" | "set" | "sort">>;
export interface ReadonlyUint8Array extends BaseReadonlyUint8Array {
    [Symbol.iterator](): IterableIterator<number>;
}
export {};
//# sourceMappingURL=types.d.ts.map