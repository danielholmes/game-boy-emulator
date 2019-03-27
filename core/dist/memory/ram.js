"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IOMemory = exports.OamMemory = exports.VRam = exports.V_RAM_SIZE = exports.WorkingRam = exports.WORKING_RAM_SIZE = exports.ZeroPageRam = void 0;

var _lodash = require("lodash");

var _ = require("..");

var _numberUtils = require("../utils/numberUtils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ByteRamStorage =
/*#__PURE__*/
function () {
  function ByteRamStorage(size) {
    _classCallCheck(this, ByteRamStorage);

    _defineProperty(this, "raw", void 0);

    _defineProperty(this, "size", void 0);

    this.size = size;
    this.raw = new Uint8Array(this.size);
  }

  _createClass(ByteRamStorage, [{
    key: "assertValidAddress",
    value: function assertValidAddress(value) {
      if (value < 0x0000 || value >= this.size) {
        throw new Error("Address ".concat((0, _.toWordHexString)(value), " out of range ").concat((0, _.toWordHexString)(this.size)));
      }
    }
  }, {
    key: "readBytes",
    value: function readBytes(address, length) {
      this.assertValidAddress(address);
      this.assertValidAddress(address + length - 1);
      return this.raw.subarray(address, address + length);
    }
  }, {
    key: "assertByte",
    value: function assertByte(value) {
      if (value < 0x00 || value > 0xff) {
        throw new Error("Out of bounds byte ".concat((0, _numberUtils.toHexString)(value)));
      }
    }
  }, {
    key: "readByte",
    value: function readByte(address) {
      this.assertValidAddress(address);
      return this.raw[address];
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.assertValidAddress(address);
      this.assertByte(value);
      this.raw[address] = value;
    }
  }, {
    key: "values",
    get: function get() {
      return this.raw;
    }
  }]);

  return ByteRamStorage;
}();

var ZeroPageRam =
/*#__PURE__*/
function () {
  function ZeroPageRam() {
    _classCallCheck(this, ZeroPageRam);

    _defineProperty(this, "storage", void 0);

    this.storage = new ByteRamStorage(0xff);
  }

  _createClass(ZeroPageRam, [{
    key: "readByte",
    value: function readByte(address) {
      return this.storage.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.storage.writeByte(address, value);
    }
  }]);

  return ZeroPageRam;
}();

exports.ZeroPageRam = ZeroPageRam;
var WORKING_RAM_SIZE = 0x2000;
exports.WORKING_RAM_SIZE = WORKING_RAM_SIZE;

var WorkingRam =
/*#__PURE__*/
function () {
  function WorkingRam() {
    _classCallCheck(this, WorkingRam);

    _defineProperty(this, "storage", void 0);

    this.storage = new ByteRamStorage(WORKING_RAM_SIZE);
  }

  _createClass(WorkingRam, [{
    key: "readByte",
    value: function readByte(address) {
      return this.storage.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.storage.writeByte(address, value);
    }
  }, {
    key: "values",
    get: function get() {
      return this.storage.values;
    }
  }]);

  return WorkingRam;
}();

exports.WorkingRam = WorkingRam;
var V_RAM_SIZE = 0x2000;
exports.V_RAM_SIZE = V_RAM_SIZE;
var TILE_DATA_TABLE_1_RANGE = [0x0000, 0x1000];
var TILE_DATA_TABLE_2_RANGE = [0x0800, 0x1800];
var TILE_DATA_BYTES = 16;
var TILE_DATA_DIMENSION = 8;
var TILE_DATA_INDICES = (0, _lodash.range)(0, (TILE_DATA_TABLE_1_RANGE[1] - TILE_DATA_TABLE_1_RANGE[0]) / TILE_DATA_BYTES);
var TILE_DATA_PIXEL_INDICES = (0, _lodash.range)(0, TILE_DATA_DIMENSION);
var TILE_DATA_BIT_MASKS = new Uint8Array(TILE_DATA_PIXEL_INDICES.map(function (i) {
  return 1 << TILE_DATA_DIMENSION - i - 1;
}));
var BG_MAP_1_RANGE = [0x1800, 0x1c00];
var BG_MAP_2_RANGE = [0x1c00, 0x2000];
var BG_MAP_DIMENSION = 32;
var BG_MAP_INDICES = (0, _lodash.range)(0, BG_MAP_DIMENSION);

var VRam =
/*#__PURE__*/
function () {
  function VRam() {
    _classCallCheck(this, VRam);

    _defineProperty(this, "storage", void 0);

    this.storage = new ByteRamStorage(V_RAM_SIZE);
  }

  _createClass(VRam, [{
    key: "readByte",
    value: function readByte(address) {
      return this.storage.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.storage.writeByte(address, value);
    }
  }, {
    key: "getBackgroundMap",
    value: function getBackgroundMap(_ref) {
      var _this = this;

      var _ref2 = _slicedToArray(_ref, 1),
          startAddress = _ref2[0];

      return BG_MAP_INDICES.map(function (y) {
        return new Uint8Array(BG_MAP_INDICES.map(function (x) {
          var address = startAddress + x + y * BG_MAP_DIMENSION;
          return _this.readByte(address);
        }));
      });
    }
  }, {
    key: "getTileDataFromTable1",
    value: function getTileDataFromTable1(index) {
      return this.getTileData(TILE_DATA_TABLE_1_RANGE, index);
    }
  }, {
    key: "getTileDataFromTable2",
    value: function getTileDataFromTable2(index) {
      return this.getTileData(TILE_DATA_TABLE_2_RANGE, index);
    }
  }, {
    key: "getTileMap",
    value: function getTileMap(addressRange) {
      var _this2 = this;

      return TILE_DATA_INDICES.map(function (i) {
        return _this2.getTileData(addressRange, i);
      });
    }
  }, {
    key: "getTileData",
    value: function getTileData(_ref3, index) {
      var _ref4 = _slicedToArray(_ref3, 2),
          startAddress = _ref4[0],
          endAddress = _ref4[1];

      var address = startAddress + index * TILE_DATA_BYTES;

      if (address < startAddress || address >= endAddress) {
        throw new Error("Tile data index ".concat(index, " is invalid"));
      }

      return (0, _lodash.chunk)(this.storage.readBytes(address, TILE_DATA_BYTES), 2).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            lowerBits = _ref6[0],
            upperBits = _ref6[1];

        return TILE_DATA_PIXEL_INDICES.map(function (i) {
          var lower = (lowerBits & TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;
          var upper = (upperBits & TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;

          if (upper === 1 && lower === 1) {
            return 3;
          }

          if (upper === 1 && lower === 0) {
            return 2;
          }

          if (upper === 0 && lower === 1) {
            return 1;
          }

          return 0;
        });
      });
    }
  }, {
    key: "values",
    get: function get() {
      return this.storage.values;
    }
  }, {
    key: "bgMap1",
    get: function get() {
      return this.getBackgroundMap(BG_MAP_1_RANGE);
    }
  }, {
    key: "bgMap2",
    get: function get() {
      return this.getBackgroundMap(BG_MAP_2_RANGE);
    }
  }, {
    key: "tileMap1",
    get: function get() {
      return this.getTileMap(TILE_DATA_TABLE_1_RANGE);
    }
  }, {
    key: "tileMap2",
    get: function get() {
      return this.getTileMap(TILE_DATA_TABLE_2_RANGE);
    }
  }], [{
    key: "initializeRandomly",
    value: function initializeRandomly() {
      var vRam = new VRam();

      for (var i = 0; i < V_RAM_SIZE; i++) {
        vRam.writeByte(i, Math.round(Math.random() * 0xff));
      }

      return vRam;
    }
  }]);

  return VRam;
}();

exports.VRam = VRam;

var OamMemory =
/*#__PURE__*/
function () {
  function OamMemory() {
    _classCallCheck(this, OamMemory);

    _defineProperty(this, "storage", void 0);

    this.storage = new ByteRamStorage(0xa0);
  }

  _createClass(OamMemory, [{
    key: "readByte",
    value: function readByte(address) {
      return this.storage.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.storage.writeByte(address, value);
    }
  }]);

  return OamMemory;
}(); // https://fms.komkon.org/GameBoy/Tech/Software.html


exports.OamMemory = OamMemory;

var IOMemory =
/*#__PURE__*/
function () {
  function IOMemory() {
    _classCallCheck(this, IOMemory);

    _defineProperty(this, "storage", void 0);

    this.storage = new ByteRamStorage(0x7f);
  }

  _createClass(IOMemory, [{
    key: "readByte",
    value: function readByte(address) {
      return this.storage.readByte(address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      this.storage.writeByte(address, value);
    }
  }]);

  return IOMemory;
}();

exports.IOMemory = IOMemory;
//# sourceMappingURL=ram.js.map