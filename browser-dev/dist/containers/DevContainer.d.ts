import React from "react";
import { VRam } from "@gebby/core";
interface DevContainerProps {
    readonly vRam: VRam;
}
declare const DevContainer: ({ vRam }: DevContainerProps) => React.ReactElement<DevContainerProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export default DevContainer;
//# sourceMappingURL=DevContainer.d.ts.map