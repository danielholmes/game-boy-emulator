import React, { ReactElement } from "react";
import PanelLayout from "./PanelLayout";
import { Device } from "@gebby/core";

interface CartridgePanelProps {
  readonly device: Device;
}

const CartridgePanel = ({  }: CartridgePanelProps): ReactElement<CartridgePanelProps> => (
  <PanelLayout title="Cartridge">TODO: Cartridge</PanelLayout>
);

export default CartridgePanel;
