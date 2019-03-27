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

export default class App extends Component<{}> {
  private device?: Device;
  private lastTime?: number;

  public constructor(props: {}) {
    super(props);

    this.runTick = this.runTick.bind(this);
  }

  public componentDidMount(): void {
    const cartridge = Cartridge.builder().build();

    const mmu = new Mmu(
      bios,
      new WorkingRam(),
      VRam.initializeRandomly(),
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

    this.device = new Device(cpu, new Gpu(mmu, screen), mmu);
    this.device.insertCartridge(cartridge);
    this.device.turnOn();

    this.lastTime = performance.now();
    this.requestTick();
  }

  private requestTick(): void {
    window.requestAnimationFrame(this.runTick);
  }

  private runTick(): void {
    if (this.lastTime === undefined || this.device === undefined) {
      throw new Error("No device or last time");
    }

    const current = performance.now();
    const passed = current - this.lastTime;
    console.log("took", passed);
    this.lastTime = current;
    this.device.tick(Math.min(16, passed));
    this.forceUpdate();
    this.requestTick();
  }

  public render(): ReactElement<{}> | null {
    if (!this.device) {
      return null;
    }
    return (
      <Fragment>
        <RunContainer />
        <DevContainer device={this.device} />
      </Fragment>
    );
  }
}
