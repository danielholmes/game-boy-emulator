/* global document */
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
  Tile, Cartridge,
  nintendoLogo,
  isValidCartridge
} from "@gebby/core";
import { range, flatMap } from "lodash";

const cartridge = new Cartridge(
  new Uint8Array([
    ...range(0x0000, 0x0104).map(() => 0x00),
    ...nintendoLogo
  ])
);
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

const drawTileToCanvas = (imageData: ImageData, tile: Tile): void => {
  const BYTES_PER_PIXEL = 4;
  tile.forEach((r, y) =>
    r.forEach((c, x) => {
      switch (c) {
        case 3:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0x00;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 2:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0x55;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 1:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0xaa;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
        case 0:
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 1] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 2] = 0xff;
          imageData.data[((y * 8) + x) * BYTES_PER_PIXEL + 3] = 0xff;
          break;
      }
    })
  );
}

const printEnd = (): void => {
  const tiles1Title = document.createElement('h3');
  tiles1Title.innerText = 'Tile Map 1'
  const tiles1 = document.createElement('div');
  tiles1.appendChild(tiles1Title);
  document.getElementsByTagName('body')[0].appendChild(tiles1);
  range(0, 255)
    .forEach((i) => {
      const tile = vRam.getTileDataFromTable1(i);
      if (flatMap(tile).some((c) => c !== 0)) {
        const tileContainer = document.createElement('div');
        tileContainer.style.cssFloat = 'left';
        tileContainer.style.margin = '5px';
        const tileTitle = document.createElement('h4');
        tileTitle.innerText = `Tile ${i}`
        tileTitle.style.margin = '2px';
        const tileCanvas = document.createElement('canvas');
        tileCanvas.width = 8;
        tileCanvas.height = 8;
        tileCanvas.style.border = '1px solid black';
        tileCanvas.style.width = '80px';
        tileCanvas.style.height = '80px';
        const tileCanvasContext = tileCanvas.getContext('2d');
        if (tileCanvasContext === null) {
          throw new Error("no 2d context");
        }
        const tileImageData = tileCanvasContext.getImageData(0, 0, tileCanvas.width, tileCanvas.height);

        tileContainer.appendChild(tileTitle);
        tileContainer.appendChild(tileCanvas);
        tiles1.appendChild(tileContainer);

        drawTileToCanvas(tileImageData, tile)
        tileCanvasContext.putImageData(tileImageData, 0, 0);
      }
    });

  const bgMap1 = document.createElement('div');
  bgMap1.style.clear = 'both';
  const bgMap1Title = document.createElement('h4')
  bgMap1Title.innerText = 'BG Map 1'
  bgMap1Title.style.margin = '2px';
  bgMap1.appendChild(bgMap1Title)

  const bgMapCanvas = document.createElement('canvas');
  bgMapCanvas.width = 256;
  bgMapCanvas.height = 256;
  bgMapCanvas.style.border = '1px solid black';
  bgMapCanvas.style.width = '512px';
  bgMapCanvas.style.height = '512px';
  const bgMapCanvasContext = bgMapCanvas.getContext('2d');
  if (bgMapCanvasContext === null) {
    throw new Error("no 2d context");
  }
  const tileCanvas = document.createElement('canvas');
  tileCanvas.width = 8;
  tileCanvas.height = 8;
  const tileCanvasContext = tileCanvas.getContext('2d');
  if (!tileCanvasContext) {
    throw new Error("Tile c c")
  }
  vRam.bgMap1
    .forEach((row, y) =>
      row.forEach((c, x) => {
        tileCanvasContext.clearRect(0, 0, tileCanvas.width, tileCanvas.height)
        const tData = tileCanvasContext.getImageData(0, 0, tileCanvas.width, tileCanvas.height)
        
        drawTileToCanvas(tData, vRam.getTileDataFromTable1(c))
        
        bgMapCanvasContext.putImageData(tData, x * 8, y * 8);
      })
    )
  bgMap1.appendChild(bgMapCanvas)
  document.getElementsByTagName('body')[0].appendChild(bgMap1)
};

const TOTAL = 1000000;
for (let i = 0; i < TOTAL; i++) {
  try {
    device.tickCycle();
  } catch (e) {
    printEnd();
    throw e;
  }
}

printEnd();
