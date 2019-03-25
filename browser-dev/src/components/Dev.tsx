import React, { ComponentType, ReactElement } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import BackgroundMap from "./BackgroundMap";
import { VRam } from "@gebby/core";
import TileMap from "./TileMap";

export type PanelId = 'VRamTileMap1' | 'BackgroundMap1';

interface PanelComponentProps {
  readonly vRam: VRam;
}

interface Panel {
  readonly id: PanelId;
  readonly label: string;
  readonly component: ComponentType<PanelComponentProps>;
}

const PANELS: ReadonlyArray<Panel> = [
  {
    id: 'VRamTileMap1',
    label: 'VRAM - Tile Map 1',
    component: TileMap
  },
  {
    id: 'BackgroundMap1',
    label: 'VRAM - Background Map 1',
    component: BackgroundMap
  }
];

interface DevProps {
  readonly vRam: VRam;
  readonly openPanels: ReadonlySet<PanelId>;
  readonly onChangePanelOpen: (panelId: PanelId, isOpen: boolean) => void;
}

const Dev = ({ vRam, openPanels, onChangePanelOpen }: DevProps): ReactElement<DevProps> => (
  <div className="dev">
    <FormGroup row>
      {PANELS.map(({ id, label }) => (
        <FormControlLabel
          key={id}
          control={
            <Switch
              checked={openPanels.has(id)}
              onChange={() => onChangePanelOpen(id, !openPanels.has(id))}
              value="checkedA"
            />
          }
          label={label}
        />
      ))}
    </FormGroup>
    {PANELS
      .filter(({ id }) => openPanels.has(id))
      .map(({ id, component: Component }) => (
        <Component key={id} vRam={vRam} />
      ))}
  </div>
);

export default Dev;
