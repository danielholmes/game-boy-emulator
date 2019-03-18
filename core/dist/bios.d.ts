import { ByteValue, MemoryAddress } from "./types";
export interface Bios {
    readByte(address: MemoryAddress): ByteValue;
}
declare const bios: Bios;
export default bios;
//# sourceMappingURL=bios.d.ts.map