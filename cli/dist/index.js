"use strict";

var _core = require("@gebby/core");

var cartridge = new _core.Cartridge(new Uint8Array([0x00, // 0x0100
0x00, // 0x0101
0x00, // 0x0102
0xCE, // 0x0104
0xED, 0x66, 0x66, 0xCC, 0x0D, 0x00, 0x0B, 0x03, 0x73, 0x00, 0x83, 0x00, 0x0C, 0x00, 0x0D, 0x00, 0x08, 0x11, 0x1F, 0x88, 0x89, 0x00, 0x0E, 0xDC, 0xCC, 0x6E, 0xE6, 0xDD, 0xDD, 0xD9, 0x99, 0xBB, 0xBB, 0x67, 0x63, 0x6E, 0x0E, 0xEC, 0xCC, 0xDD, 0xDC, 0x99, 0x9F, 0xBB, 0xB9, 0x33, 0x3E]));
var vRam = new _core.VRam(); // VRam.initializeRandomly();

var mmu = new _core.Mmu(_core.bios, new _core.WorkingRam(), vRam, new _core.IOMemory(), new _core.OamMemory(), new _core.ZeroPageRam());
var screen = {
  setPixel: function setPixel() {// TODO:
  }
};
var cpu = new _core.Cpu();
var device = new _core.Device(cpu, new _core.Gpu(mmu, screen), mmu);
device.turnOn();

for (var i = 0; i < 1000000; i++) {
  console.log(i.toString() + ') 0x' + cpu.registers.pc.toString(16) + ' 0x' + mmu.readByte(cpu.registers.pc).toString(16));
  device.tickCycle();

  if (i % 200 === 0) {
    var values = vRam.getValues();
    var filled = {};

    for (var j = 0; j < values.length; j++) {
      if (values[j] !== 0) {
        filled[j] = values[j];
      }
    }

    console.log("-------- " + Object.keys(filled).length.toString(16)); // console.log(
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
//# sourceMappingURL=index.js.map