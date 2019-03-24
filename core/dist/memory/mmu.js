"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mmu = void 0;

var _types = require("../types");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Mmu =
/*#__PURE__*/
function () {
  function Mmu(bios, ram, vRam, io, oam, zeroPage, cartridge) {
    _classCallCheck(this, Mmu);

    _defineProperty(this, "bios", void 0);

    _defineProperty(this, "workingRam", void 0);

    _defineProperty(this, "vRam", void 0);

    _defineProperty(this, "io", void 0);

    _defineProperty(this, "oam", void 0);

    _defineProperty(this, "zeroPage", void 0);

    _defineProperty(this, "cartridge", void 0);

    this.bios = bios;
    this.workingRam = ram;
    this.vRam = vRam;
    this.oam = oam;
    this.io = io;
    this.zeroPage = zeroPage;
    this.cartridge = cartridge;
  }

  _createClass(Mmu, [{
    key: "loadCartridge",
    value: function loadCartridge(cartridge) {
      this.cartridge = cartridge;
    } // TODO: Test access and shadowing

  }, {
    key: "readByte",
    value: function readByte(address) {
      // TODO: Once the bios has run, it is removed and goes through to cartridge
      if (address >= 0x0000 && address <= 0x00ff && this.isInBios) {
        return this.bios.readByte(address);
      }

      if (address >= 0x0000 && address <= 0x7fff) {
        if (!this.cartridge) {
          // throw new Error(`Cannot access address ${numberToWordHex(address)}: no cartridge`);
          return 0;
        }

        return this.cartridge.readByte(address);
      }

      if (address >= 0x8000 && address <= 0x9fff) {
        return this.vRam.readByte(address - 0x8000);
      }

      if (address >= 0xc000 && address <= 0xdfff) {
        return this.workingRam.readByte(address - 0xc000);
      }

      if (address >= 0xa000 && address <= 0xbfff) {
        throw new Error("TODO: Access memory on cartridge");
      }

      if (address >= 0xe000 && address <= 0xfdff) {
        return this.workingRam.readByte(address - 0xe000);
      }

      if (address >= 0xff80 && address <= 0xffff) {
        return this.zeroPage.readByte(address - 0xff80);
      }

      if (address >= 0xfe00 && address <= 0xfe9f) {
        return this.oam.readByte(address - 0xfe00);
      }

      if (address >= 0xfea0 && address <= 0xfeff) {
        // Unused space
        return 0;
      }

      if (address >= 0xfe00 && address <= 0xfe9f) {
        // Graphics: sprite information: Data about the sprites rendered by the graphics chip are held here, including the
        // sprites' positions and attributes.
        throw new Error("graphics mem not yet implemented");
      }

      if (address >= 0xff00 && address <= 0xff7f) {
        return this.io.readByte(address - 0xff00);
      }

      throw new Error("Address not readable");
    }
  }, {
    key: "readBigEndianWord",
    value: function readBigEndianWord(address) {
      return (this.readByte(address + 1) << 8) + this.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      if (address === 0xff50) {
        console.log('Writing bios', value.toString(16));
      }

      if (address >= 0x8000 && address <= 0x9fff) {
        this.vRam.writeByte(address - 0x8000, value);
      } else if (address >= 0xa000 && address <= 0xbfff) {
        throw new Error("Cannot write to ".concat((0, _types.numberToWordHex)(address), " which is on cartridge"));
      } else if (address >= 0xc000 && address <= 0xdfff) {
        this.workingRam.writeByte(address - 0xc000, value);
      } else if (address >= 0xe000 && address <= 0xfdff) {
        this.workingRam.writeByte(address - 0xe000, value);
      } else if (address >= 0xff80 && address <= 0xffff) {
        this.zeroPage.writeByte(address - 0xff80, value);
      } else if (address >= 0xff00 && address <= 0xff7f) {
        this.io.writeByte(address - 0xff00, value);
      } else if (address >= 0xfe00 && address <= 0xfe9f) {
        this.oam.writeByte(address - 0xfe00, value);
      } else if (address >= 0xfea0 && address <= 0xfeff) {// Unused space, do nothing
      } else {
        throw new Error("Can't write address ".concat((0, _types.numberToWordHex)(address)));
      }
    }
  }, {
    key: "writeWordBigEndian",
    value: function writeWordBigEndian(address, value) {
      this.writeByte(address + 1, value >> 8);
      this.writeByte(address, value & 255);
    }
  }, {
    key: "isInBios",
    get: function get() {
      return this.readByte(0xff50) !== 0x00;
    }
  }, {
    key: "bGP",
    get: function get() {
      return this.readByte(0xff47);
    }
  }, {
    key: "scY",
    get: function get() {
      return this.readByte(0xff42);
    }
  }, {
    key: "scX",
    get: function get() {
      return this.readByte(0xff43);
    }
  }, {
    key: "workingRamValues",
    get: function get() {
      return this.workingRam.getValues();
    }
  }]);

  return Mmu;
}(); // [0000-3FFF] Cartridge ROM, bank 0: The first 16,384 bytes of the cartridge program are always available at this point in the memory map. Special circumstances apply:
// [0000-00FF] BIOS: When the CPU starts up, PC starts at 0000h, which is the start of the 256-byte GameBoy BIOS code. Once the BIOS has run, it is removed from the memory map, and this area of the cartridge rom becomes addressable.
// [0100-014F] Cartridge header: This section of the cartridge contains data about its name and manufacturer, and must be written in a specific format.
// [4000-7FFF]


exports.Mmu = Mmu;
//# sourceMappingURL=mmu.js.map