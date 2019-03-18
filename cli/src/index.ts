import { Device, Cpu, Gpu, Mmu, bios, IOMemory, VRam, WorkingRam, ZeroPageRam, OamMemory, Cartridge } from "@gebby/core";
import { toPairs, sortBy } from "lodash";

const cartridge = new Cartridge(
  new Uint8Array([
    0x00, // 0x0100
    0x00, // 0x0101
    0x00, // 0x0102
    0xCE, // 0x0104
    0xED,
    0x66,
    0x66,
    0xCC,
    0x0D,
    0x00,
    0x0B,
    0x03,
    0x73,
    0x00,
    0x83,
    0x00,
    0x0C,
    0x00,
    0x0D,
    0x00,
    0x08,
    0x11,
    0x1F,
    0x88,
    0x89,
    0x00,
    0x0E,
    0xDC,
    0xCC,
    0x6E,
    0xE6,
    0xDD,
    0xDD,
    0xD9,
    0x99,
    0xBB,
    0xBB,
    0x67,
    0x63,
    0x6E,
    0x0E,
    0xEC,
    0xCC,
    0xDD,
    0xDC,
    0x99,
    0x9F,
    0xBB,
    0xB9,
    0x33,
    0x3E
  ])
);

const vRam = new VRam(); // VRam.initializeRandomly();

const mmu = new Mmu(
  bios,
  new WorkingRam(),
  vRam,
  new IOMemory(),
  new OamMemory(),
  new ZeroPageRam()
);

const screen = {
  setPixel(): void {
    // TODO:
  }
};

const cpu = new Cpu()

const device = new Device(
  cpu,
  new Gpu(mmu, screen),
  mmu
);

for (let i = 0; i < 1000000; i++) {
  console.log(i.toString() + ') 0x' + cpu.registers.pc.toString(16) + ' 0x' + mmu.readByte(cpu.registers.pc).toString(16));
  device.tick();
  if (i % 200 === 0) {
    const values = vRam.getValues();
    const filled: { [address: number]: number; } = {};
    for (let j = 0; j < values.length; j++) {
      if (values[j] !== 0) {
        filled[j] = values[j];
      }
    }
    console.log("-------- " + Object.keys(filled).length.toString(16));
    // console.log(
    //   sortBy(
    //     toPairs(filled),
    //     ([address, ]) => address
    //   )
    //     .map(([address, value]) =>
    //       `0x${parseInt(address).toString(16)}: 0x${value.toString(16)}`
    //     )
    //     .join(' ')
    // );
  }
}

console.log("done");
