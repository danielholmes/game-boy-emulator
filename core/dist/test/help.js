"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCpuSnapshot = exports.createMemorySnapshot = exports.createMmuWithCartridgeAndValues = exports.createMmuWithValues = exports.createCpuRegistersWithRegisters = exports.createCpuWithRegisters = exports.EMPTY_MEMORY = exports.createMmu = void 0;

var _lodash = require("lodash");

var _mmu = require("../memory/mmu");

var _bios = _interopRequireDefault(require("../bios"));

var _ram = require("../memory/ram");

var _cpu = require("../cpu");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createMmu = function createMmu() {
  return new _mmu.Mmu(_bios.default, new _ram.WorkingRam(), new _ram.VRam(), new _ram.IOMemory(), new _ram.OamMemory(), new _ram.ZeroPageRam());
};

exports.createMmu = createMmu;
var EMPTY_MEMORY = createMmu(); // Dummy to get around typing

exports.EMPTY_MEMORY = EMPTY_MEMORY;

var isRegister = function isRegister(name) {
  return !!name;
};

var createCpuWithRegisters = function createCpuWithRegisters(withRegisters) {
  var cpu = new _cpu.Cpu();
  (0, _lodash.toPairs)(withRegisters).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        register = _ref2[0],
        value = _ref2[1];

    if (isRegister(register) && typeof value !== "undefined") {
      cpu.registers[register] = value;
    }
  });
  return cpu;
};

exports.createCpuWithRegisters = createCpuWithRegisters;

var createCpuRegistersWithRegisters = function createCpuRegistersWithRegisters(withRegisters) {
  return createCpuWithRegisters(withRegisters).registers;
};

exports.createCpuRegistersWithRegisters = createCpuRegistersWithRegisters;

var createMmuWithValues = function createMmuWithValues(values) {
  var mmu = createMmu();
  (0, _lodash.toPairs)(values).forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        address = _ref4[0],
        value = _ref4[1];

    return mmu.writeByte(parseInt(address), value);
  });
  return mmu;
};

exports.createMmuWithValues = createMmuWithValues;

var createMmuWithCartridgeAndValues = function createMmuWithCartridgeAndValues(cartridge, values) {
  var mmu = createMmuWithValues(values || {});
  mmu.loadCartridge(cartridge);
  return mmu;
}; // TODO:


exports.createMmuWithCartridgeAndValues = createMmuWithCartridgeAndValues;

var createMemorySnapshot = function createMemorySnapshot(mmu) {
  return _typeof(mmu);
}; // TODO:


exports.createMemorySnapshot = createMemorySnapshot;

var createCpuSnapshot = function createCpuSnapshot(cpu) {
  return _typeof(cpu);
};

exports.createCpuSnapshot = createCpuSnapshot;
//# sourceMappingURL=help.js.map