import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";
import { Device } from "@gebby/core";

interface MemoryInspectorPanelProps {
  readonly name: string;
  readonly device: Device;
}

const MemoryInspectorPanel = ({
  name
}: MemoryInspectorPanelProps): ReactElement<MemoryInspectorPanelProps> => (
  <PanelLayout title={`Memory - ${name}`}>
    <div>
      TODO: An inspector for memory blocks. Drills down with a zoom. e.g. lines
      then 10x10, etc.
    </div>
  </PanelLayout>
);

type SpecificMemoryInspectorPanelProps = Pick<
  MemoryInspectorPanelProps,
  Exclude<keyof MemoryInspectorPanelProps, "name">
>;

const VRamMemoryInspectorPanel = (
  props: SpecificMemoryInspectorPanelProps
): ReactElement<SpecificMemoryInspectorPanelProps> => (
  <MemoryInspectorPanel name="VRam" {...props} />
);

const WorkingRamMemoryInspectorPanel = (
  props: SpecificMemoryInspectorPanelProps
): ReactElement<SpecificMemoryInspectorPanelProps> => (
  <MemoryInspectorPanel name="Working Ram" {...props} />
);

export { VRamMemoryInspectorPanel, WorkingRamMemoryInspectorPanel };
