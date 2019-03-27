import React, { ReactElement, ReactNode } from "react";

interface PanelLayoutProps {
  readonly title: string;
  readonly children: ReactNode;
}

const PanelLayout = ({
  title,
  children
}: PanelLayoutProps): ReactElement<PanelLayoutProps> => (
  <div>
    <h4>{title}</h4>
    {children}
  </div>
);

export default PanelLayout;
