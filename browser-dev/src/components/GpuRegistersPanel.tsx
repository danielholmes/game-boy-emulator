import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";
import { Device } from "@gebby/core";

interface GpuRegistersPanelProps {
  readonly device: Device;
}

const GpuRegistersPanel = ({
  device: { mmu }
}: GpuRegistersPanelProps): ReactElement<GpuRegistersPanelProps> => (
  <PanelLayout title="GPU - Registers">
    SCX: {mmu.scX}
    <br />
    SCY: {mmu.scY}
    <br />
    BGP: {mmu.bgP}
    <br />
    OBP0: {mmu.obP0}
    <br />
    OBP1: {mmu.obP1}
  </PanelLayout>
);

export default GpuRegistersPanel;
