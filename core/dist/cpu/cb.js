"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCbBit = exports.createCb = void 0;

var _instructions = require("./instructions");

var _lodash = require("lodash");

var _types = require("../types");

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
        throw new Error("No instruction for opCode ".concat((0, _types.numberToByteHex)(operand)));
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

var createCbBit = function createCbBit(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "BIT ".concat(register)).bitFlags(register);
};

exports.createCbBit = createCbBit;
var CB_INSTRUCTIONS = (0, _lodash.fromPairs)(_toConsumableArray([[0x7b, "e"], [0x7c, "h"]].map(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      opCode = _ref2[0],
      register = _ref2[1];

  return createCbBit(opCode, register);
})).map(function (i) {
  return [i.opCode, i];
}));
//# sourceMappingURL=cb.js.map