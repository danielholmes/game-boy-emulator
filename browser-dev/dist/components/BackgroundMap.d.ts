import { Component, ReactElement } from "react";
import { VRam } from "@gebby/core";
interface BackgroundMapProps {
    readonly vRam: VRam;
}
export default class BackgroundMap extends Component<BackgroundMapProps> {
    private canvas?;
    private tileCanvas;
    constructor(props: BackgroundMapProps);
    private onCanvasRef;
    private renderCanvas;
    componentDidUpdate(prevProps: Readonly<BackgroundMapProps>): void;
    render(): ReactElement<BackgroundMapProps>;
}
export {};
//# sourceMappingURL=BackgroundMapPanel.d.ts.map