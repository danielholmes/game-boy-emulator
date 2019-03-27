"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mmu = exports.WORKING_RAM_RANGE = void 0;

var _ = require("..");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WORKING_RAM_RANGE = {
  start: 0xc000,
  end: 0xe000
};
exports.WORKING_RAM_RANGE = WORKING_RAM_RANGE;

var Mmu =
/*#__PURE__*/
function () {
  function Mmu(bios, ram, vRam, io, oam, zeroPage, cartridge) {
    _classCallCheck(this, Mmu);

    _defineProperty(this, "bios", void 0);

    _defineProperty(this, "workingRam", void 0);

    _defineProperty(this, "_vRam", void 0);

    _defineProperty(this, "io", void 0);

    _defineProperty(this, "oam", void 0);

    _defineProperty(this, "zeroPage", void 0);

    _defineProperty(this, "cartridge", void 0);

    this.bios = bios;
    this.workingRam = ram;
    this._vRam = vRam;
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
      if (address >= 0x0000 && address <= 0x00ff && this.isInBios) {
        return this.bios.readByte(address);
      }

      if (address >= 0x0000 && address <= 0x7fff) {
        if (!this.cartridge) {
          return 0x00;
        }

        return this.cartridge.readByte(address);
      }

      if (address >= 0x8000 && address < 0xa000) {
        return this.vRam.readByte(address - 0x8000);
      }

      if (address >= 0xa000 && address < WORKING_RAM_RANGE.start) {
        throw new Error("TODO: Access memory on cartridge");
      }

      if (address >= WORKING_RAM_RANGE.start && address <= WORKING_RAM_RANGE.end) {
        return this.workingRam.readByte(address - WORKING_RAM_RANGE.start);
      } // Shadow of working ram


      if (address >= 0xe000 && address < 0xfe00) {
        return this.workingRam.readByte(address - 0xe000);
      }

      if (address >= 0xfe00 && address <= 0xfe9f) {
        return this.oam.readByte(address - 0xfe00);
      }

      if (address >= 0xfe00 && address < 0xfea0) {
        // Graphics: sprite information: Data about the sprites rendered by the graphics chip are held here, including the
        // sprites' positions and attributes.
        throw new Error("graphics mem not yet implemented");
      }

      if (address >= 0xfea0 && address <= 0xfeff) {
        // Unused space
        return 0;
      }

      if (address >= 0xff00 && address < 0xff80) {
        return this.io.readByte(address - 0xff00);
      } // TODO: This high ram/zero page


      if (address >= 0xff80 && address < 0xffff) {
        return this.zeroPage.readByte(address - 0xff80);
      }

      if (address === 0xffff) {
        throw new Error("Interrupts not implemented yet");
      }

      throw new Error("Address not readable");
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      if (address >= 0x8000 && address <= 0x9fff) {
        this._vRam.writeByte(address - 0x8000, value);
      } else if (address >= 0xa000 && address <= 0xbfff) {
        throw new Error("Cannot write to ".concat((0, _.toWordHexString)(address), " which is on cartridge"));
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
        throw new Error("Can't write address ".concat((0, _.toWordHexString)(address)));
      }
    }
  }, {
    key: "vRam",
    get: function get() {
      return this._vRam;
    }
  }, {
    key: "isInBios",
    get: function get() {
      return this.readByte(0xff50) === 0x00;
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
      return this.workingRam.values;
    }
  }]);

  return Mmu;
}();

exports.Mmu = Mmu;
//# sourceMappingURL=mmu.js.map