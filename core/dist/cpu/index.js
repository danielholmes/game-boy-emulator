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

var _call = require("./call");

var _push = require("./push");

var _rl = require("./rl");

var _pop = require("./pop");

var _ret = require("./ret");

var _sub = require("./sub");

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

// const CLOCK_CYCLES_PER_MACHINE_CYCLE = 4;
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
      // TODO: Convert to low level
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
}(); // LD (HL),n 36 12
// DEC (HL) 35 12


exports.Cpu = Cpu;
var INSTRUCTIONS = (0, _lodash.fromPairs)([(0, _special.createNop)(0x00)].concat(_toConsumableArray([[0x7f, "a", "a"], [0x78, "a", "b"], [0x79, "a", "c"], [0x7a, "a", "d"], [0x7b, "a", "e"], [0x7c, "a", "h"], [0x7d, "a", "l"], [0x47, "b", "a"], [0x40, "b", "b"], [0x41, "b", "c"], [0x42, "b", "d"], [0x43, "b", "e"], [0x44, "b", "h"], [0x45, "b", "l"], [0x4f, "c", "a"], [0x48, "c", "b"], [0x49, "c", "c"], [0x4a, "c", "d"], [0x4b, "c", "e"], [0x4c, "c", "h"], [0x4d, "c", "l"], [0x57, "d", "a"], [0x50, "d", "b"], [0x51, "d", "c"], [0x52, "d", "d"], [0x53, "d", "e"], [0x54, "d", "h"], [0x55, "d", "l"], [0x5f, "e", "a"], [0x58, "e", "b"], [0x59, "e", "c"], [0x5a, "e", "d"], [0x5b, "e", "e"], [0x5c, "e", "h"], [0x5d, "e", "l"], [0x67, "h", "a"], [0x60, "h", "b"], [0x61, "h", "c"], [0x62, "h", "d"], [0x63, "h", "e"], [0x64, "h", "h"], [0x65, "h", "l"], [0x6f, "l", "a"], [0x68, "l", "b"], [0x69, "l", "c"], [0x6a, "l", "d"], [0x6b, "l", "e"], [0x6c, "l", "h"], [0x6d, "l", "l"]].map(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      opCode = _ref2[0],
      register1 = _ref2[1],
      register2 = _ref2[2];

  return (0, _ld.createLdRR)(opCode, register1, register2);
})), [(0, _ld.createLdMNnA)(0xea), (0, _call.createCallNn)(0xcd)], _toConsumableArray([[0xf5, "af"], [0xc5, "bc"], [0xd5, "de"], [0xe5, "hl"]].map(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      opCode = _ref4[0],
      register = _ref4[1];

  return (0, _push.createPush)(opCode, register);
})), _toConsumableArray([[0x70, "b"], [0x71, "c"], [0x72, "d"], [0x73, "e"], [0x74, "h"], [0x75, "l"], [0x77, "a"]].map(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      opCode = _ref6[0],
      register = _ref6[1];

  return (0, _ld.createLdHlMR)(opCode, register);
})), _toConsumableArray([[0x7e, "a", "hl"], [0x46, "b", "hl"], [0x4e, "c", "hl"], [0x56, "d", "hl"], [0x5e, "e", "hl"], [0x66, "h", "hl"], [0x6e, "l", "hl"], [0x0a, "a", "bc"], [0x1a, "a", "de"]].map(function (_ref7) {
  var _ref8 = _slicedToArray(_ref7, 3),
      opCode = _ref8[0],
      register1 = _ref8[1],
      register2 = _ref8[2];

  return (0, _ld.createLdRMRr)(opCode, register1, register2);
})), _toConsumableArray([[0x02, "bc"], [0x12, "de"], [0x77, "hl"]].map(function (_ref9) {
  var _ref10 = _slicedToArray(_ref9, 2),
      opCode = _ref10[0],
      register = _ref10[1];

  return (0, _ld.createLdMRA)(opCode, register);
})), [(0, _ld.createLdMNA)(0xe0)], _toConsumableArray([[0x06, "b"], [0x0e, "c"], [0x16, "d"], [0x1e, "e"], [0x26, "h"], [0x2e, "l"], [0x3e, "a"]].map(function (_ref11) {
  var _ref12 = _slicedToArray(_ref11, 2),
      opCode = _ref12[0],
      register = _ref12[1];

  return (0, _ld.createLdRN)(opCode, register);
})), _toConsumableArray([[0x01, "bc"], [0x11, "de"], [0x21, "hl"], [0x31, "sp"]].map(function (_ref13) {
  var _ref14 = _slicedToArray(_ref13, 2),
      opCode = _ref14[0],
      register = _ref14[1];

  return (0, _ld.createLdRrNn)(opCode, register);
})), _toConsumableArray([[0xc7, 0x0000], [0xcf, 0x0008], [0xd7, 0x0010], [0xdf, 0x0018], [0xe7, 0x0020], [0xef, 0x0028], [0xf7, 0x0030], [0xff, 0x0038]].map(function (_ref15) {
  var _ref16 = _slicedToArray(_ref15, 2),
      opCode = _ref16[0],
      value = _ref16[1];

  return (0, _rst.createRst)(opCode, value);
})), [(0, _rl.createRlR)(0x17, "a"), (0, _ld.createLdMNnSp)(0x08)], _toConsumableArray([[0xf1, "af"], [0xc1, "bc"], [0xd1, "de"], [0xe1, "hl"]].map(function (_ref17) {
  var _ref18 = _slicedToArray(_ref17, 2),
      opCode = _ref18[0],
      register = _ref18[1];

  return (0, _pop.createPopRr)(opCode, register);
})), _toConsumableArray([[0x3d, "a"], [0x05, "b"], [0x0d, "c"], [0x15, "d"], [0x1d, "e"], [0x25, "h"], [0x2d, "l"]].map(function (_ref19) {
  var _ref20 = _slicedToArray(_ref19, 2),
      opCode = _ref20[0],
      register = _ref20[1];

  return (0, _dec.createDecR)(opCode, register);
})), _toConsumableArray([[0x03, "bc"], [0x13, "de"], [0x23, "hl"]].map(function (_ref21) {
  var _ref22 = _slicedToArray(_ref21, 2),
      opCode = _ref22[0],
      register = _ref22[1];

  return (0, _inc.createIncRr)(opCode, register);
})), [(0, _inc.createIncSp)(0x33)], _toConsumableArray([[0x3c, "a"], [0x04, "b"], [0x0c, "c"], [0x14, "d"], [0x1c, "e"], [0x24, "h"], [0x2c, "l"]].map(function (_ref23) {
  var _ref24 = _slicedToArray(_ref23, 2),
      opCode = _ref24[0],
      register = _ref24[1];

  return (0, _inc.createIncR)(opCode, register);
})), _toConsumableArray([[0xaf, "a"], [0xa8, "b"], [0xa9, "c"], [0xaa, "d"], [0xab, "e"], [0xac, "h"], [0xad, "l"]].map(function (_ref25) {
  var _ref26 = _slicedToArray(_ref25, 2),
      opCode = _ref26[0],
      register = _ref26[1];

  return (0, _xor.createXorR)(opCode, register);
})), _toConsumableArray([[0x97, "a"], [0x90, "b"], [0x91, "c"], [0x92, "d"], [0x93, "e"], [0x94, "h"], [0x95, "l"]].map(function (_ref27) {
  var _ref28 = _slicedToArray(_ref27, 2),
      opCode = _ref28[0],
      register = _ref28[1];

  return (0, _sub.createSubR)(opCode, register);
})), [(0, _sub.createSubMHl)(0x96), (0, _ld.createLddMHlA)(0x32), (0, _ld.createLdiMHlA)(0x22), (0, _ld.createLdMCA)(0xe2), (0, _cb.createCb)(0xcb), (0, _ret.createRet)(0xc9), (0, _jr.createJrNzN)(0x20)], _toConsumableArray([[0x9f, "a"], [0x98, "b"], [0x99, "c"], [0x9a, "d"], [0x9b, "e"], [0x9c, "h"], [0x9d, "l"]].map(function (_ref29) {
  var _ref30 = _slicedToArray(_ref29, 2),
      opCode = _ref30[0],
      register = _ref30[1];

  return (0, _sbc.createSbcAR)(opCode, register);
}))).map(function (i) {
  return [i.opCode, i];
}));
//# sourceMappingURL=index.js.map