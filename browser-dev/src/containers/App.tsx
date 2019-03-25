import React, { Component, ReactElement, Fragment } from "react";
import {
  Device,
  Cpu,
  Gpu,
  Mmu,
  bios,
  IOMemory,
  VRam,
  WorkingRam,
  ZeroPageRam,
  OamMemory,
  Cartridge
} from "@gebby/core";
import DevContainer from "./DevContainer";
import RunContainer from "./RunContainer";

export default class App extends Component<{}, { device: Device }> {
  private vRam?: VRam;

  componentDidMount (): void {
    const cartridge = Cartridge.builder().build();

    this.vRam = VRam.initializeRandomly();

    const mmu = new Mmu(
      bios,
      new WorkingRam(),
      this.vRam,
      new IOMemory(),
      new OamMemory(),
      new ZeroPageRam()
    );

    const screen = {
      setPixel(): void {
        // TODO:
      }
    };

    const cpu = new Cpu();

    const device = new Device(cpu, new Gpu(mmu, screen), mmu);
    device.insertCartridge(cartridge);
    device.turnOn();

    let lastTime: number = performance.now();
    const requestTick = () => {
      window.requestAnimationFrame(() => {
        const current = performance.now();
        const passed = current - lastTime;
        console.log("took", passed);
        lastTime = current;
        device.tick(Math.min(16, passed));
        this.forceUpdate();
        requestTick();
      });
    };

    requestTick();

    this.setState({ device });
  }

  public render(): ReactElement<{}> | null {
    if (!this.vRam) {
      return null;
    }
    return (
      <Fragment>
        <RunContainer />
        <DevContainer vRam={this.vRam} />
      </Fragment>
    );
  }
}
