import React, { ReactElement, ReactNode } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

interface PanelLayoutProps {
  readonly title: string;
  readonly children: ReactNode;
}

const PanelLayout = ({
  title,
  children
}: PanelLayoutProps): ReactElement<PanelLayoutProps> => (
  <Paper elevation={1} style={{ padding: 10 }}>
    <Typography variant="h5">{title}</Typography>
    {children}
  </Paper>
);

export default PanelLayout;
