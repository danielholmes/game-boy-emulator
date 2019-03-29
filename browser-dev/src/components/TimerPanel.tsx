import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";
import { Device } from "@gebby/core";

interface TimerPanelProps {
  readonly device: Device;
}

const TimerPanel = ({  }: TimerPanelProps): ReactElement<TimerPanelProps> => (
  <PanelLayout title="Timers">TODO: Timers</PanelLayout>
);

export default TimerPanel;
