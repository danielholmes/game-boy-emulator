import React, { useState } from "react";
import Dev, { PanelId } from "../components/Dev";
import { ReactElement } from "react";
import { Device } from "@gebby/core";

interface DevContainerProps {
  readonly device: Device;
}

const DevContainer = ({
  device
}: DevContainerProps): ReactElement<DevContainerProps> => {
  const [openPanels, setOpenPanels] = useState<ReadonlySet<PanelId>>(new Set());

  return (
    <Dev
      device={device}
      onChangePanelOpen={(id, isOpen) => {
        const updatedOpenPanels = new Set(openPanels);
        if (isOpen) {
          setOpenPanels(updatedOpenPanels.add(id));
          return;
        }

        updatedOpenPanels.delete(id);
        setOpenPanels(updatedOpenPanels);
      }}
      openPanels={openPanels}
    />
  );
};

export default DevContainer;
