import React from 'react';
import Dev, { PanelId } from "../components/Dev";
import { Component, ReactElement } from "react";
import { VRam } from "@gebby/core";

interface DevContainerProps {
  readonly vRam: VRam;
}

interface DevContainerState {
  readonly openPanels: ReadonlySet<PanelId>;
}

export class DevContainer extends Component<DevContainerProps, DevContainerState> {
  state = {
    openPanels: new Set()
  };

  private onChangePanelOpen(id: PanelId, isOpen: boolean): void {
    if (isOpen) {
      this.setState({
        openPanels: new Set(this.state.openPanels.add(id))
      });
      return;
    }

    const openPanels = new Set(this.state.openPanels);
    openPanels.delete(id);
    this.setState({ openPanels });
  }

  public render(): ReactElement<DevContainerProps> {
    return (
      <Dev
        vRam={this.props.vRam}
        onChangePanelOpen={this.onChangePanelOpen.bind(this)}
        openPanels={this.state.openPanels}
      />
    )
  }
}
