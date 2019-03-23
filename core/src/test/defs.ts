import { MmuSnapshot } from "./help";

namespace jest {
  interface Matchers<Mmu> {
    toMatchSnapshotWorkingRam(value: MmuSnapshot): Mmu;
  }
}
