/* global expect */
import { createMmuSnapshot, MmuSnapshot } from "./help";
import { Mmu } from "../memory/mmu";

expect.extend({
  toMatchSnapshotWorkingRam(received: Mmu, snapshot: MmuSnapshot) {
    if (received === null) {
      return {
        pass: true,
        message: () => 'Mmu expected to be not null.'
      };
    }

    const receivedSnapshot = createMmuSnapshot(received);
    if (this.isNot) {
      expect(receivedSnapshot.workingRamValues).not.toEqual(snapshot.workingRamValues);
    } else {
      expect(receivedSnapshot.workingRamValues).toEqual(snapshot.workingRamValues);
    }

    // This point is reached when the above assertion was successful.
    // The test should therefore always pass, that means it needs to be
    // `true` when used normally, and `false` when `.not` was used.
    return { pass: !this.isNot, message: '' }
  }
});
