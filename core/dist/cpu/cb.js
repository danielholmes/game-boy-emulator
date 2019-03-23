"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCbBitBMHl = exports.createCbBitBR = exports.createCb = void 0;

var _instructions = require("./instructions");

var _lodash = require("lodash");

var _types = require("../types");

var _rl = require("./rl");

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

var CbInstruction =
/*#__PURE__*/
function () {
  function CbInstruction(opCode) {
    _classCallCheck(this, CbInstruction);

    _defineProperty(this, "opCode", void 0);

    _defineProperty(this, "label", "CB");

    this.opCode = opCode;
  }

  _createClass(CbInstruction, [{
    key: "execute",
    value: function execute(cpu, mmu) {
      var operand = mmu.readByte(cpu.registers.pc); // eslint-disable-next-line @typescript-eslint/no-use-before-define

      var subInstruction = CB_INSTRUCTIONS[operand];

      if (!subInstruction) {
        throw new Error("No instruction for CB opCode ".concat((0, _types.numberToByteHex)(operand)));
      }

      cpu.registers.pc++;
      subInstruction.execute(cpu, mmu);
      return 4;
    }
  }]);

  return CbInstruction;
}();

var createCb = function createCb(opCode) {
  return new CbInstruction(opCode);
};

exports.createCb = createCb;

var createCbBitBR = function createCbBitBR(opCode, position, register) {
  return new _instructions.InstructionDefinition(opCode, "BIT ".concat(position, ", ").concat(register)).loadRegister(register).bitFlags(position);
};

exports.createCbBitBR = createCbBitBR;

var createCbBitBMHl = function createCbBitBMHl(opCode, position) {
  return new _instructions.InstructionDefinition(opCode, "BIT ".concat(position, ", (hl)")).loadRegister('hl').readMemory().bitFlags(position);
};

exports.createCbBitBMHl = createCbBitBMHl;
var CB_INSTRUCTIONS = (0, _lodash.fromPairs)([].concat(_toConsumableArray([[0x40, 0, "b"], [0x41, 0, "c"], [0x42, 0, "d"], [0x43, 0, "e"], [0x44, 0, "h"], [0x45, 0, "l"], [0x47, 0, "a"], [0x48, 1, "b"], [0x49, 1, "c"], [0x4a, 1, "d"], [0x4b, 1, "e"], [0x4c, 1, "h"], [0x4d, 1, "l"], [0x4f, 1, "a"], [0x50, 2, "b"], [0x51, 2, "c"], [0x52, 2, "d"], [0x53, 2, "e"], [0x54, 2, "h"], [0x55, 2, "l"], [0x57, 2, "a"], [0x58, 3, "b"], [0x59, 3, "c"], [0x5a, 3, "d"], [0x5b, 3, "e"], [0x5c, 3, "h"], [0x5d, 3, "l"], [0x5f, 3, "a"], [0x60, 4, "b"], [0x61, 4, "c"], [0x62, 4, "d"], [0x63, 4, "e"], [0x64, 4, "h"], [0x65, 4, "l"], [0x67, 4, "a"], [0x68, 5, "b"], [0x69, 5, "c"], [0x6a, 5, "d"], [0x6b, 5, "e"], [0x6c, 5, "h"], [0x6d, 5, "l"], [0x6f, 5, "a"], [0x70, 6, "b"], [0x71, 6, "c"], [0x72, 6, "d"], [0x73, 6, "e"], [0x74, 6, "h"], [0x75, 6, "l"], [0x77, 6, "a"], [0x78, 7, "b"], [0x79, 7, "c"], [0x7a, 7, "d"], [0x7b, 7, "e"], [0x7c, 7, "h"], [0x7d, 7, "l"], [0x7f, 7, "a"]].map(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
      opCode = _ref2[0],
      position = _ref2[1],
      register = _ref2[2];

  return createCbBitBR(opCode, position, register);
})), _toConsumableArray([[0x46, 0], [0x4e, 1], [0x56, 2], [0x5e, 3], [0x66, 4], [0x6e, 5], [0x76, 6], [0x7e, 7]].map(function (_ref3) {
  var _ref4 = _slicedToArray(_ref3, 2),
      opCode = _ref4[0],
      position = _ref4[1];

  return createCbBitBMHl(opCode, position);
})), _toConsumableArray([[0x17, "a"], [0x10, "b"], [0x11, "c"], [0x12, "d"], [0x13, "e"], [0x14, "h"], [0x15, "l"]].map(function (_ref5) {
  var _ref6 = _slicedToArray(_ref5, 2),
      opCode = _ref6[0],
      register = _ref6[1];

  return (0, _rl.createRlR)(opCode, register);
}))).map(function (i) {
  return [i.opCode, i];
}));
//# sourceMappingURL=cb.js.map