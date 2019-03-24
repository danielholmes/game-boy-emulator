"use strict";

var _core = require("@gebby/core");

var _lodash = require("lodash");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var cartridge = new _core.Cartridge(new Uint8Array([].concat(_toConsumableArray((0, _lodash.range)(0x0000, 0x0104).map(function () {
  return 0x00;
})), _toConsumableArray(_core.nintendoLogo))));

if (!(0, _core.isValidCartridge)(cartridge)) {
  throw new Error("Invalid cartridge");
}

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
// Console pixels: console.log('\u2591', '\u2592', '\u2588');

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
  console.log("BG & window palette", mmu.bGP.toString(2));
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
  console.log("Background map 1:");
  console.log(vRam.bgMap1.map(function (row) {
    return row.map(function (i) {
      return tileToString(vRam.getTileDataFromTable1(i));
    }).reduce(function (accu, tile) {
      return (0, _lodash.zip)(accu.split("\n"), tile.split("\n")).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            accuRow = _ref2[0],
            newRow = _ref2[1];

        return accuRow + newRow;
      }).join("\n");
    }, (0, _lodash.repeat)("\n", 7));
  }).join("\n"));
};

var TOTAL = 100000;

for (var i = 0; i < TOTAL; i++) {
  var opCode = mmu.readByte(cpu.registers.pc);
  console.log(i.toString() + ")", "@0x" + cpu.registers.pc.toString(16), "0x" + opCode.toString(16), cpu.getInstructionLabel(opCode));

  try {
    device.tickCycle();
  } catch (e) {
    printEnd();
    throw e;
  } // if (i % 1000 === 0 || i === (TOTAL - 1)) {
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
//# sourceMappingURL=index.js.map