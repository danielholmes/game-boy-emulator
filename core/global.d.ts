import { MmuSnapshot } from "./src/test/help";
import { WithRegisters } from "./src/test/setUp";
import { ByteValue } from "./src/types";

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toMatchWorkingRam(value: { [address: number]: ByteValue; }): R;
      toMatchSnapshotWorkingRam(value: MmuSnapshot): R;
      toEqualCpuWithRegisters(value: WithRegisters): R;
      toEqualCpuRegisters(value: WithRegisters): R;
    }
  }
}
