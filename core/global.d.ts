import { MmuSnapshot } from "./src/test/help";
import { WithRegisters } from "./src/test/setUp";

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSnapshotWorkingRam(value: MmuSnapshot): R;
      toEqualCpuWithRegisters(value: WithRegisters): R;
      toEqualCpuRegisters(value: WithRegisters): R;
    }
  }
}
