import React, { ReactNode } from "react";
interface PanelLayoutProps {
    readonly title: string;
    readonly children: ReactNode;
}
declare const PanelLayout: ({ title, children }: PanelLayoutProps) => React.ReactElement<PanelLayoutProps, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export default PanelLayout;
//# sourceMappingURL=PanelLayout.d.ts.map