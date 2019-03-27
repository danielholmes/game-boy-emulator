import React, { ReactElement } from "react";
import { Device } from "@gebby/core";
import PanelLayout from "./PanelLayout";

interface ProgramPanelProps {
  readonly device: Device;
}

const ProgramPanel = ({

}: ProgramPanelProps): ReactElement<ProgramPanelProps> => (
  <PanelLayout title="CPU - Instructions">
    <div>
      TODO: Display a list of 20 or so bytes. including approx 3 before PC and 7
      afterwards including mapping to instruction names. Need access to low
      level op stack to work this out
    </div>
  </PanelLayout>
);

export default ProgramPanel;
