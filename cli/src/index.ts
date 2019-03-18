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
  OamMemory
} from "@gebby/core";

/* const cartridge = new Cartridge(
  new Uint8Array([
    0x00, // 0x0100
    0x00, // 0x0101
    0x00, // 0x0102
    0xce, // 0x0104
    0xed,
    0x66,
    0x66,
    0xcc,
    0x0d,
    0x00,
    0x0b,
    0x03,
    0x73,
    0x00,
    0x83,
    0x00,
    0x0c,
    0x00,
    0x0d,
    0x00,
    0x08,
    0x11,
    0x1f,
    0x88,
    0x89,
    0x00,
    0x0e,
    0xdc,
    0xcc,
    0x6e,
    0xe6,
    0xdd,
    0xdd,
    0xd9,
    0x99,
    0xbb,
    0xbb,
    0x67,
    0x63,
    0x6e,
    0x0e,
    0xec,
    0xcc,
    0xdd,
    0xdc,
    0x99,
    0x9f,
    0xbb,
    0xb9,
    0x33,
    0x3e
  ])
);*/

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

const cpu = new Cpu();

const device = new Device(cpu, new Gpu(mmu, screen), mmu);
device.turnOn();

for (let i = 0; i < 1000000; i++) {
  console.log(
    i.toString() +
      ") 0x" +
      cpu.registers.pc.toString(16) +
      " 0x" +
      mmu.readByte(cpu.registers.pc).toString(16)
  );
  device.tickCycle();
  if (i % 200 === 0) {
    const values = vRam.getValues();
    const filled: { [address: number]: number } = {};
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
