import React from "react";
import { VRam } from "@gebby/core";
export declare type PanelId = 'VRamTileMap1' | 'BackgroundMap1';
interface DevProps {
    readonly vRam: VRam;
    readonly openPanels: ReadonlySet<PanelId>;
    readonly onChangePanelOpen: (panelId: PanelId, isOpen: boolean) => void;
}
declare const Dev: ({ vRam, openPanels, onChangePanelOpen }: DevProps) => React.ReactElement<DevProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export default Dev;
//# sourceMappingURL=Dev.d.ts.map