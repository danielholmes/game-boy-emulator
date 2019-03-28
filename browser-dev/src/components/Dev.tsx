import React, { ComponentType, ReactElement } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { BackgroundMapPanel1, BackgroundMapPanel2 } from "./BackgroundMapPanel";
import { Device } from "@gebby/core";
import { TileMapPanel1, TileMapPanel2 } from "./TileMapPanel";
import CpuRegistersPanel from "./CpuRegistersPanel";
import OamSpritesPanel from "./OamSpritesPanel";
import ProgramPanel from "./ProgramPanel";
import TimerPanel from "./TimerPanel";
import {
  VRamMemoryInspectorPanel,
  WorkingRamMemoryInspectorPanel
} from "./MemoryInspectorPanel";
import GpuRegistersPanel from "./GpuRegistersPanel";

export type PanelId = "VRamTileMap1" |
  "BackgroundMap1" |
  "VRamTileMap2" |
  "BackgroundMap2" |
  "CpuRegisters" |
  "GpuRegisters" |
  "Program" |
  "WorkingRamInspector" |
  "VRamInspector" |
  "Timer" |
  "OamSprites";

interface PanelComponentProps {
  readonly device: Device;
}

interface Panel {
  readonly id: PanelId;
  readonly label: string;
  readonly component: ComponentType<PanelComponentProps>;
}

const PANELS: ReadonlyArray<Panel> = [
  {
    id: "CpuRegisters",
    label: "CPU - Registers",
    component: CpuRegistersPanel
  },
  {
    id: "GpuRegisters",
    label: "GPU - Registers",
    component: GpuRegistersPanel
  },
  {
    id: "VRamTileMap1",
    label: "VRAM - Tile Map 1",
    component: TileMapPanel1
  },
  {
    id: "VRamTileMap2",
    label: "VRAM - Tile Map 2",
    component: TileMapPanel2
  },
  {
    id: "BackgroundMap1",
    label: "VRAM - Background Map 1",
    component: BackgroundMapPanel1
  },
  {
    id: "BackgroundMap2",
    label: "VRAM - Background Map 2",
    component: BackgroundMapPanel2
  },
  {
    id: "Program",
    label: "CPU - Program",
    component: ProgramPanel
  },
  {
    id: "VRamInspector",
    label: "Ram - VRam Inspector",
    component: VRamMemoryInspectorPanel
  },
  {
    id: "WorkingRamInspector",
    label: "Ram - Working Ram Inspector",
    component: WorkingRamMemoryInspectorPanel
  },
  {
    id: "OamSprites",
    label: "Oam - Sprites",
    component: OamSpritesPanel
  },
  {
    id: "Timer",
    label: "Timer",
    component: TimerPanel
  }
];

interface DevProps {
  readonly device: Device;
  readonly openPanels: ReadonlySet<PanelId>;
  readonly onChangePanelOpen: (panelId: PanelId, isOpen: boolean) => void;
}

const Dev = ({
  device,
  openPanels,
  onChangePanelOpen
}: DevProps): ReactElement<DevProps> => (
  <div className="dev">
    <FormGroup row>
      {PANELS.map(({ id, label }) => (
        <FormControlLabel
          key={id}
          control={
            <Checkbox
              checked={openPanels.has(id)}
              onChange={() => onChangePanelOpen(id, !openPanels.has(id))}
              value="checkedA"
            />
          }
          label={label}
        />
      ))}
    </FormGroup>
    {PANELS.filter(({ id }) => openPanels.has(id)).map(
      ({ id, component: Component }) => (
        <Component key={id} device={device} />
      )
    )}
  </div>
);

export default Dev;
