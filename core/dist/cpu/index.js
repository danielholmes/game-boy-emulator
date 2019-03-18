"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cpu = void 0;

var _lodash = require("lodash");

var _ld = require("./ld");

var _registers = require("./registers");

var _rst = require("./rst");

var _dec = require("./dec");

var _inc = require("./inc");

var _special = require("./special");

var _xor = require("./xor");

var _types = require("../types");

var _cb = require("./cb");

var _jr = require("./jr");

var _sbc = require("./sbc");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Cpu =
/*#__PURE__*/
function () {
  // Temporary variable until refactor done
  function Cpu() {
    _classCallCheck(this, Cpu);

    _defineProperty(this, "registers", void 0);

    _defineProperty(this, "remainingCycles", void 0);

    this.registers = new _registers.CpuRegistersImpl();
    this.remainingCycles = 0;
  } // TODO: See device comments for changes


  _createClass(Cpu, [{
    key: "tick",
    value: function tick(mmu, cycles) {
      this.remainingCycles += cycles; // Note: that this currently goes below 0 which is a no no. Should only
      // simulate up to current available cycles

      while (this.remainingCycles > 4) {
        this.tickCycle(mmu);
      }
    }
  }, {
    key: "tickCycle",
    value: function tickCycle(mmu) {
      var opCode = mmu.readByte(this.registers.pc);
      this.remainingCycles -= 4; // eslint-disable-next-line @typescript-eslint/no-use-before-define

      var instruction = INSTRUCTIONS[opCode];

      if (!instruction) {
        throw new Error("No instruction for opCode ".concat((0, _types.numberToByteHex)(opCode), " reading from pc ").concat((0, _types.numberToByteHex)(this.registers.pc)));
      }

      this.registers.pc++;
      this.remainingCycles -= instruction.execute(this, mmu);
    }
  }]);

  return Cpu;
}(); // LD A,(HL) 7E 8
// LD B,(HL) 46 8
// LD C,(HL) 4E 8
// LD D,(HL) 56 8
// LD E,(HL) 5E 8
// LD H,(HL) 66 8
// LD L,(HL) 6E 8
// LD (HL),n 36 12
// DEC (HL) 35 12


exports.Cpu = Cpu;
var INSTRUCTIONS = (0, _lodash.fromPairs)([(0, _special.createNop)(0x00)].concat(_toConsumableArray([[0x7f, "a", "a"], [0x78, "a", "b"], [0x79, "a", "c"], [0x7a, "a", "d"], [0x7b, "a", "e"], [0x7c, "a", "h"], [0x7d, "a", "l"], [0x40, "b", "b"], [0x41, "b", "c"], [0x42, "b", "d"], [0x43, "b", "e"], [0x44, "b", "h"], [0x45, "b", "l"], [0x48, "c", "b"], [0x49, "c", "c"], [0x4a, "c", "d"], [0x4b, "c", "e"], [0x4c, "c", "h"], [0x4d, "c", "l"], [0x50, "d", "b"], [0x51, "d", "c"], [0x52, "d", "d"], [0x53, "d", "e"], [0x54, "d", "h"], [0x55, "d", "l"], [0x58, "e", "b"], [0x59, "e", "c"], [0x5a, "e", "d"], [0x5b, "e", "e"], [0x5c, "e", "h"], [0x5d, "e", "l"], [0x60, "h", "b"], [0x61, "h", "c"], [0x62, "h", "d"], [0x63, "h", "e"], [0x64, "h", "h"], [0x65, "h", "l"], [0x68, "l", "b"], [0x69, "l", "c"], [0x6a, "l", "d"], [0x6b, "l", "e"], [0x6c, "l", "h"], [0x6d, "l", "l"]].map(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      opCode = _ref2[0],
      register1 = _ref2[1],
      register2 = _ref2[2];

  return (0, _ld.createLdRR)(opCode, register1, register2);
})), [(0, _ld.createLdMNnA)(0xea)], _toConsumableArray([[0x70, "b"], [0x71, "c"], [0x72, "d"], [0x73, "e"], [0x74, "h"], [0x75, "l"], [0x77, "a"]].map(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      opCode = _ref4[0],
      register = _ref4[1];

  return (0, _ld.createLdHlMR)(opCode, register);
})), _toConsumableArray([[0x0a, "bc"], [0x1a, "de"], [0x7e, "hl"]].map(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      opCode = _ref6[0],
      register = _ref6[1];

  return (0, _ld.createLdMRA)(opCode, register);
})), [(0, _ld.createLdMNA)(0xe0)], _toConsumableArray([[0x06, "b"], [0x0e, "c"], [0x16, "d"], [0x1e, "e"], [0x26, "h"], [0x2e, "l"], [0x3e, "a"]].map(function (_ref7) {
  var _ref8 = _slicedToArray(_ref7, 2),
      opCode = _ref8[0],
      register = _ref8[1];

  return (0, _ld.createLdRN)(opCode, register);
})), _toConsumableArray([[0x01, "bc"], [0x11, "de"], [0x21, "hl"]].map(function (_ref9) {
  var _ref10 = _slicedToArray(_ref9, 2),
      opCode = _ref10[0],
      register = _ref10[1];

  return (0, _ld.createLdGrNn)(opCode, register);
})), [(0, _ld.createLdSpNn)(0x31)], _toConsumableArray([[0xc7, 0x0000], [0xcf, 0x0008], [0xd7, 0x0010], [0xdf, 0x0018], [0xe7, 0x0020], [0xef, 0x0028], [0xf7, 0x0030], [0xff, 0x0038]].map(function (_ref11) {
  var _ref12 = _slicedToArray(_ref11, 2),
      opCode = _ref12[0],
      value = _ref12[1];

  return (0, _rst.createRst)(opCode, value);
})), [(0, _ld.createLdMNnSp)(0x08)], _toConsumableArray([[0x3d, "a"], [0x05, "b"], [0x0d, "c"], [0x15, "d"], [0x1d, "e"], [0x25, "h"], [0x2d, "l"]].map(function (_ref13) {
  var _ref14 = _slicedToArray(_ref13, 2),
      opCode = _ref14[0],
      register = _ref14[1];

  return (0, _dec.createDecR)(opCode, register);
})), _toConsumableArray([[0x03, "bc"], [0x13, "de"], [0x23, "hl"]].map(function (_ref15) {
  var _ref16 = _slicedToArray(_ref15, 2),
      opCode = _ref16[0],
      register = _ref16[1];

  return (0, _inc.createIncRr)(opCode, register);
})), [(0, _inc.createIncSp)(0x33)], _toConsumableArray([[0x3c, "a"], [0x04, "b"], [0x0c, "c"], [0x14, "d"], [0x1c, "e"], [0x24, "h"], [0x2c, "l"]].map(function (_ref17) {
  var _ref18 = _slicedToArray(_ref17, 2),
      opCode = _ref18[0],
      register = _ref18[1];

  return (0, _inc.createIncR)(opCode, register);
})), _toConsumableArray([[0xaf, "a"], [0xa8, "b"], [0xa9, "c"], [0xaa, "d"], [0xab, "e"], [0xac, "h"], [0xad, "l"]].map(function (_ref19) {
  var _ref20 = _slicedToArray(_ref19, 2),
      opCode = _ref20[0],
      register = _ref20[1];

  return (0, _xor.createXorR)(opCode, register);
})), [(0, _ld.createLddMHlA)(0x32), (0, _ld.createLdMCA)(0xe2), (0, _cb.createCb)(0xcb), (0, _jr.createJrNzN)(0x20)], _toConsumableArray([[0x9f, "a"], [0x98, "b"], [0x99, "c"], [0x9a, "d"], [0x9b, "e"], [0x9c, "h"], [0x9d, "l"]].map(function (_ref21) {
  var _ref22 = _slicedToArray(_ref21, 2),
      opCode = _ref22[0],
      register = _ref22[1];

  return (0, _sbc.createSbcAR)(opCode, register);
}))).map(function (i) {
  return [i.opCode, i];
}));
//# sourceMappingURL=index.js.map