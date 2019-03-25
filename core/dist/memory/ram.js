"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IOMemory = exports.OamMemory = exports.VRam = exports.V_RAM_SIZE = exports.WorkingRam = exports.WORKING_RAM_SIZE = exports.ZeroPageRam = void 0;

var _lodash = require("lodash");

var _ = require("..");

var _numberUtils = require("../utils/numberUtils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Ram =
/*#__PURE__*/
function () {
  function Ram(size) {
    _classCallCheck(this, Ram);

    _defineProperty(this, "raw", void 0);

    _defineProperty(this, "size", void 0);

    this.size = size;
    this.raw = new Uint8Array(this.size);
  }

  _createClass(Ram, [{
    key: "assertValidAddress",
    value: function assertValidAddress(value) {
      if (value < 0x0000 || value >= this.size) {
        throw new Error("Address ".concat((0, _.toWordHexString)(value), " out of range ").concat((0, _.toWordHexString)(this.size)));
      }
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
    key: "readBytes",
    value: function readBytes(address, length) {
      this.assertValidAddress(address);
      this.assertValidAddress(address + length - 1);
      return this.raw.subarray(address, address + length);
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

  return Ram;
}();

var ZeroPageRam =
/*#__PURE__*/
function (_Ram) {
  _inherits(ZeroPageRam, _Ram);

  function ZeroPageRam() {
    _classCallCheck(this, ZeroPageRam);

    return _possibleConstructorReturn(this, _getPrototypeOf(ZeroPageRam).call(this, 0xff));
  }

  return ZeroPageRam;
}(Ram);

exports.ZeroPageRam = ZeroPageRam;
var WORKING_RAM_SIZE = 0x2000;
exports.WORKING_RAM_SIZE = WORKING_RAM_SIZE;

var WorkingRam =
/*#__PURE__*/
function (_Ram2) {
  _inherits(WorkingRam, _Ram2);

  function WorkingRam() {
    _classCallCheck(this, WorkingRam);

    return _possibleConstructorReturn(this, _getPrototypeOf(WorkingRam).call(this, WORKING_RAM_SIZE));
  }

  return WorkingRam;
}(Ram);

exports.WorkingRam = WorkingRam;
var V_RAM_SIZE = 0x2000;
exports.V_RAM_SIZE = V_RAM_SIZE;

var VRam =
/*#__PURE__*/
function (_Ram3) {
  _inherits(VRam, _Ram3);

  function VRam() {
    _classCallCheck(this, VRam);

    return _possibleConstructorReturn(this, _getPrototypeOf(VRam).call(this, V_RAM_SIZE));
  }

  _createClass(VRam, [{
    key: "getBackgroundMap",
    value: function getBackgroundMap(_ref) {
      var _this = this;

      var _ref2 = _slicedToArray(_ref, 1),
          startAddress = _ref2[0];

      return VRam.BG_MAP_INDICES.map(function (y) {
        return new Uint8Array(VRam.BG_MAP_INDICES.map(function (x) {
          var address = startAddress + x + y * VRam.BG_MAP_DIMENSION;
          return _this.readByte(address);
        }));
      });
    }
  }, {
    key: "getTileDataFromTable1",
    value: function getTileDataFromTable1(index) {
      return this.getTileData(VRam.TILE_DATA_TABLE_1_RANGE, index);
    }
  }, {
    key: "getTileDataFromTable2",
    value: function getTileDataFromTable2(index) {
      return this.getTileData(VRam.TILE_DATA_TABLE_2_RANGE, index);
    }
  }, {
    key: "getTileData",
    value: function getTileData(_ref3, index) {
      var _ref4 = _slicedToArray(_ref3, 2),
          startAddress = _ref4[0],
          endAddress = _ref4[1];

      var address = startAddress + index * VRam.TILE_DATA_BYTES;

      if (address < startAddress || address >= endAddress) {
        throw new Error("Tile data index ".concat(index, " is invalid"));
      }

      return (0, _lodash.chunk)(this.readBytes(address, VRam.TILE_DATA_BYTES), 2).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            lowerBits = _ref6[0],
            upperBits = _ref6[1];

        return VRam.TILE_DATA_INDICES.map(function (i) {
          var lower = (lowerBits & VRam.TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;
          var upper = (upperBits & VRam.TILE_DATA_BIT_MASKS[i]) === 0 ? 0 : 1;

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
    key: "bgMap1",
    get: function get() {
      return this.getBackgroundMap(VRam.BG_MAP_1_RANGE);
    }
  }, {
    key: "bgMap2",
    get: function get() {
      return this.getBackgroundMap(VRam.BG_MAP_2_RANGE);
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
}(Ram);

exports.VRam = VRam;

_defineProperty(VRam, "TILE_DATA_TABLE_1_RANGE", [0x0000, 0x1000]);

_defineProperty(VRam, "TILE_DATA_TABLE_2_RANGE", [0x0800, 0x1800]);

_defineProperty(VRam, "TILE_DATA_BYTES", 16);

_defineProperty(VRam, "TILE_DATA_DIMENSION", 8);

_defineProperty(VRam, "TILE_DATA_INDICES", (0, _lodash.range)(0, VRam.TILE_DATA_DIMENSION));

_defineProperty(VRam, "TILE_DATA_BIT_MASKS", new Uint8Array(VRam.TILE_DATA_INDICES.map(function (i) {
  return 1 << VRam.TILE_DATA_DIMENSION - i - 1;
})));

_defineProperty(VRam, "BG_MAP_1_RANGE", [0x1800, 0x1c00]);

_defineProperty(VRam, "BG_MAP_2_RANGE", [0x1c00, 0x2000]);

_defineProperty(VRam, "BG_MAP_DIMENSION", 32);

_defineProperty(VRam, "BG_MAP_INDICES", (0, _lodash.range)(0, VRam.BG_MAP_DIMENSION));

var OamMemory =
/*#__PURE__*/
function (_Ram4) {
  _inherits(OamMemory, _Ram4);

  function OamMemory() {
    _classCallCheck(this, OamMemory);

    return _possibleConstructorReturn(this, _getPrototypeOf(OamMemory).call(this, 0xa0));
  }

  return OamMemory;
}(Ram); // https://fms.komkon.org/GameBoy/Tech/Software.html


exports.OamMemory = OamMemory;

var IOMemory =
/*#__PURE__*/
function (_Ram5) {
  _inherits(IOMemory, _Ram5);

  function IOMemory() {
    _classCallCheck(this, IOMemory);

    return _possibleConstructorReturn(this, _getPrototypeOf(IOMemory).call(this, 0x7f));
  }

  _createClass(IOMemory, [{
    key: "readByte",
    value: function readByte(address) {
      return _get(_getPrototypeOf(IOMemory.prototype), "readByte", this).call(this, address);
    }
  }, {
    key: "writeByte",
    value: function writeByte(address, value) {
      // bios seems to use it
      // if (address === 0x0044) {
      //   throw new Error("Current scan line Read-only");
      // }
      _get(_getPrototypeOf(IOMemory.prototype), "writeByte", this).call(this, address, value);
    }
  }]);

  return IOMemory;
}(Ram);

exports.IOMemory = IOMemory;
//# sourceMappingURL=ram.js.map