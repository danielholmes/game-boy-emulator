import { Component, ReactElement } from "react";
import { Tile } from "@gebby/core";
interface TileMapTileProps {
    readonly index: number;
    readonly tile: Tile;
}
export default class TileMapTile extends Component<TileMapTileProps> {
    private canvas?;
    private onCanvasRef;
    private renderCanvas;
    componentDidUpdate(prevProps: Readonly<TileMapTileProps>): void;
    render(): ReactElement<TileMapTileProps>;
}
export {};
//# sourceMappingURL=TileMapTile.d.ts.map