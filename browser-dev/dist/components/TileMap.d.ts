import React from "react";
import { VRam } from "@gebby/core";
interface TileMapProps {
    readonly vRam: VRam;
}
declare const TileMap: ({ vRam }: TileMapProps) => React.ReactElement<TileMapProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export default TileMap;
//# sourceMappingURL=TileMap.d.ts.map