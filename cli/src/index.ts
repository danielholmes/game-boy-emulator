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
  PixelColor,
  Tile,
  Cartridge,
  isValidCartridge
} from "@gebby/core";
import { range, flatMap, repeat, zip } from "lodash";

const cartridge = Cartridge.builder().build();
if (!isValidCartridge(cartridge)) {
  throw new Error("Invalid cartridge");
}

const vRam = VRam.initializeRandomly();

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
device.insertCartridge(cartridge);
device.turnOn();

// process.stdout.write instead of console.log
// Clear: console.log('\033c')
// Alt: console.log('\033c\033[3J')
// Console pixels: console.log('\u2591', '\u2592', '\u2588');

const pixelToOutChar = (color: PixelColor): string => {
  switch (color) {
    case 3:
      return "\u2588";
    case 2:
      return "\u2592";
    case 1:
      return "\u2591";
  }
  return " ";
};

const tileToString = (tile: Tile): string =>
  tile.map(r => r.map(pixelToOutChar).join("")).join("\n");

const printEnd = (): void => {
  console.log("BG & window palette", mmu.bGP.toString(2));

  console.log("Table 1 tiles:");
  range(0, 255).forEach(i => {
    const tile = vRam.getTileDataFromTable1(i);
    if (flatMap(tile).some(c => c !== 0)) {
      console.log(i + ")");
      console.log(tileToString(tile));
    }
  });

  console.log("Table 2 tiles:");
  range(0, 255).forEach(i => {
    const tile = vRam.getTileDataFromTable2(i);
    if (flatMap(tile).some(c => c !== 0)) {
      console.log(i + ")");
      console.log(tileToString(tile));
    }
  });

  console.log("Background map 1:");
  console.log(
    vRam.bgMap1
      .map(row =>
        row
          .map(i => tileToString(vRam.getTileDataFromTable1(i)))
          .reduce(
            (accu: string, tile: string): string =>
              zip(accu.split("\n"), tile.split("\n"))
                .map(([accuRow, newRow]) => (accuRow || "") + newRow)
                .join("\n"),
            repeat("\n", 7)
          )
      )
      .join("\n")
  );
};

const TOTAL = 100000;
for (let i = 0; i < TOTAL; i++) {
  const opCode = mmu.readByte(cpu.registers.pc);
  console.log(
    i.toString() + ")",
    "@0x" + cpu.registers.pc.toString(16),
    "0x" + opCode.toString(16),
    cpu.getInstructionLabel(opCode)
  );
  try {
    device.tickCycle();
  } catch (e) {
    printEnd();
    throw e;
  }
  // if (i % 1000 === 0 || i === (TOTAL - 1)) {
  //   const values = vRam.getValues();
  //   const filled: { [address: number]: number } = {};
  //   for (let j = 0; j < values.length; j++) {
  //     if (values[j] !== 0) {
  //       filled[j] = values[j];
  //     }
  //   }
  //   const addresses = Object.keys(filled).map((k) => parseInt(k)).sort();
  //   console.log("MEM", addresses.length);
  //   if (addresses.length > 0) {
  //     const V_RAM_BASE = 0x8000;
  //     console.log(
  //       "  0x" + (addresses.sort()[0] + V_RAM_BASE).toString(16),
  //       "(0x" + filled[addresses[0]].toString(16) + ")",
  //       "-",
  //       "0x" + (addresses[addresses.length - 1] + V_RAM_BASE).toString(16)
  //     );
  //   }
  //   // console.log(
  //   //   sortBy(
  //   //     toPairs(filled),
  //   //     ([address, ]) => address
  //   //   )
  //   //     .map(([address, value]) =>
  //   //       `0x${parseInt(address).toString(16)}: 0x${value.toString(16)}`
  //   //     )
  //   //     .join(' ')
  //   // );
  // }
}

printEnd();
