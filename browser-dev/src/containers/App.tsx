import React, { Fragment, useEffect, useState } from "react";
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

function App () {
  const [device] = useState(
    () => {
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

      const device = new Device(cpu, new Gpu(mmu, screen), mmu);
      device.insertCartridge(cartridge);
      device.turnOn();
      return device;
    }
  );

  // Not sure if this is better or worse than running on animation frame.
  // React probably uses requestAnimationFrame under the hood?
  useEffect(
    () => {
      let lastTime = performance.now();

      function runTick() {
        const current = performance.now();
        const passed = current - lastTime;
        // console.log('took', passed);
        device.tick(Math.min(16, passed));
        lastTime = current;
        window.requestAnimationFrame(runTick)
      }

      runTick();
    },
    [device]
  );

  return (
    <Fragment>
      <RunContainer />
      <DevContainer device={device} />
    </Fragment>
  );
}

export default App
