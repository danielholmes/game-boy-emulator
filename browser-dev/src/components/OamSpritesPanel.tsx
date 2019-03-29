import React, { ReactElement } from "react";
import { Device } from "@gebby/core";
import PanelLayout from "./PanelLayout";

interface OamSpritesPanelProps {
  readonly device: Device;
}

const OamSpritesPanel = ({

}: OamSpritesPanelProps): ReactElement<OamSpritesPanelProps> => (
  <PanelLayout title="Oam - Sprites">
    <div>TODO: Oam sprites</div>
  </PanelLayout>
);

export default OamSpritesPanel;
