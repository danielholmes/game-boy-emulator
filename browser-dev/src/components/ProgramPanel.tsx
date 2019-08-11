import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";

/*import { Device } from "@gebby/core";
interface ProgramPanelProps {
  readonly device: Device;
}*/

const ProgramPanel = (): ReactElement<{}> => (
  <PanelLayout title="CPU - Instructions">
    <div>
      TODO: Display a list of 20 or so bytes. including approx 3 before PC and 7
      afterwards including mapping to instruction names. Need access to low
      level op stack to work this out
    </div>
  </PanelLayout>
);

export default ProgramPanel;
