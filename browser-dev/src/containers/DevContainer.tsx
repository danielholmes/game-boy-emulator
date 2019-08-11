import React, { useReducer } from "react";
import Dev, { PanelId } from "../components/Dev";
import { ReactElement } from "react";
import { Device } from "@gebby/core";

interface DevContainerProps {
  readonly device: Device;
}

function DevContainer({ device }: DevContainerProps): ReactElement<DevContainerProps> {
  const [openPanels, onChangePanelOpen] = useReducer(
    (previous: ReadonlySet<PanelId>, {id, isOpen}: {id: PanelId, isOpen: boolean}) => {
      const updatedOpenPanels: Set<PanelId> = new Set(previous);
      if (isOpen) {
        return updatedOpenPanels.add(id);
      }

      updatedOpenPanels.delete(id);
      return updatedOpenPanels;
    },
    new Set()
  );

  return (
    <Dev
      device={device}
      onChangePanelOpen={onChangePanelOpen}
      openPanels={openPanels}
    />
  );
}

export default DevContainer;
