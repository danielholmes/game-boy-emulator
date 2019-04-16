"use strict";

var _core = require("@gebby/core");

var _lodash = require("lodash");

var cartridge = _core.Cartridge.builder().build();

var vRam = _core.VRam.initializeRandomly();

var mmu = new _core.Mmu(_core.bios, new _core.WorkingRam(), vRam, new _core.IOMemory(), new _core.OamMemory(), new _core.ZeroPageRam());
var screen = {
  setPixel: function setPixel() {// TODO:
  }
};
var cpu = new _core.Cpu();
var device = new _core.Device(cpu, new _core.Gpu(mmu, screen), mmu);
device.insertCartridge(cartridge);
device.turnOn(); // process.stdout.write instead of console.log
// Clear: console.log('\033c')
// Alt: console.log('\033c\033[3J')
// Console pixels: console.log('\u2591', '\u2592', '\u2588')
// light 2591 2592 2593 dark   2588 fully black/solid
// If running in a black terminal, then that might be reversed i guess?
// See https://nodejs.org/api/stream.html#stream_writable_cork
// think you can cork then uncork to prevent half scene being rendered
// see also "process.setImmediate" for timer
// process.stdout.write
// See https://www.npmjs.com/package/terminal-kit
// See comment here about using the half block and bk and fg colors:
// https://github.com/cronvel/terminal-kit/blob/HEAD/doc/high-level.md#ref.drawImage

var pixelToOutChar = function pixelToOutChar(color) {
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

var tileToString = function tileToString(tile) {
  return tile.map(function (r) {
    return r.map(pixelToOutChar).join("");
  }).join("\n");
};

var printEnd = function printEnd() {
  console.log("BG & window palette", mmu.bgP.toString(2));
  console.log("Table 1 tiles:");
  (0, _lodash.range)(0, 255).forEach(function (i) {
    var tile = vRam.getTileDataFromTable1(i);

    if ((0, _lodash.flatMap)(tile).some(function (c) {
      return c !== 0;
    })) {
      console.log(i + ")");
      console.log(tileToString(tile));
    }
  });
  console.log("Table 2 tiles:");
  (0, _lodash.range)(0, 255).forEach(function (i) {
    var tile = vRam.getTileDataFromTable2(i);

    if ((0, _lodash.flatMap)(tile).some(function (c) {
      return c !== 0;
    })) {
      console.log(i + ")");
      console.log(tileToString(tile));
    }
  });
  console.log("Background map 1:"); // console.log(
  //   vRam.bgMap1
  //     .map(row =>
  //       [...row]
  //         .map(i => tileToString(vRam.getTileDataFromTable1(i)))
  //         .reduce(
  //           (accu: string, tile: string): string =>
  //             zip(accu.split("\n"), tile.split("\n"))
  //               .map(([accuRow, newRow]) => (accuRow || "") + newRow)
  //               .join("\n"),
  //           repeat("\n", 7)
  //         )
  //     )
  //     .join("\n")
  // );
};

var TOTAL = 500000;

for (var i = 0; i < TOTAL; i++) {
  var opCode = mmu.readByte(cpu.registers.pc);
  console.log(i.toString() + ")", "@0x" + cpu.registers.pc.toString(16), "0x" + opCode.toString(16), cpu.getInstructionLabel(opCode));

  try {
    device.tickCycle();
  } catch (e) {
    printEnd();
    throw e;
  } // if (i % 1000 === 0 || i === (TOTAL - 1)) {
  //   const values = vRam.values();
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
//# sourceMappingURL=index.js.map