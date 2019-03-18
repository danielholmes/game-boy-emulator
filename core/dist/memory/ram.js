"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IOMemory = exports.OamMemory = exports.VRam = exports.V_RAM_SIZE = exports.WorkingRam = exports.ZeroPageRam = void 0;

var _types = require("../types");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

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
    key: "getValues",
    value: function getValues() {
      return this.raw.slice();
    }
  }, {
    key: "assertValidAddress",
    value: function assertValidAddress(value) {
      if (value < 0x0000 || value >= this.size) {
        throw new Error("Address ".concat((0, _types.numberToWordHex)(value), " out of range ").concat((0, _types.numberToWordHex)(this.size)));
      }
    }
  }, {
    key: "assertByte",
    value: function assertByte(value) {
      if (value < 0x00 || value > 0xff) {
        throw new Error("Out of bounds byte ".concat((0, _types.numberToHex)(value)));
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

var WorkingRam =
/*#__PURE__*/
function (_Ram2) {
  _inherits(WorkingRam, _Ram2);

  function WorkingRam() {
    _classCallCheck(this, WorkingRam);

    return _possibleConstructorReturn(this, _getPrototypeOf(WorkingRam).call(this, 0x2000));
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

  _createClass(VRam, null, [{
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