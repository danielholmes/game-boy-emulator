import React, { Component, ReactElement } from "react";
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
  CartridgeBuilder
} from "@gebby/core";
import { range } from "lodash";
import TileMap from "./TileMap";
import BackgroundMap from "./BackgroundMap";

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
        console.log('took', passed);
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
      <div>
        <TileMap
          tiles={range(0, 0x100)
            .map((i) => this.vRam.getTileDataFromTable1(i))
            .filter((t) => t.some((r) => r.some((c) => c !== 0)))}
        />
        <BackgroundMap vRam={this.vRam} bgMap={this.vRam.bgMap1}/>
      </div>
    )
  }
}
