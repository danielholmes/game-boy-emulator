import React, { ReactElement } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import BackgroundMap from "./BackgroundMap";
import { range } from "lodash";
import { VRam } from "@gebby/core";
import TileMap from "./TileMap";

export type PanelId = 'VRamTileMap1' | 'BackgroundMap1';

interface Panel {
  readonly id: PanelId;
  readonly label: string;
}

const PANELS: ReadonlyArray<Panel> = [
  { id: 'VRamTileMap1', label: 'VRAM - Tile Map 1' },
  { id: 'BackgroundMap1', label: 'VRAM - Background Map 1' }
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
    <TileMap
      tiles={range(0, 0x100)
        .map((i) => vRam.getTileDataFromTable1(i))
        .filter((t) => t.some((r) => r.some((c) => c !== 0)))}
    />
    <BackgroundMap vRam={vRam} bgMap={vRam.bgMap1}/>
  </div>
);

export default Dev;
