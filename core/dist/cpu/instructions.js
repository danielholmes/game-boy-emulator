"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstructionDefinition = void 0;

var _lowLevel = require("./lowLevel");

var _lodash = require("lodash");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: Definition to generate label?
// TODO: A chained instruction definition that only allows valid
// e.g. not allow loadFromRegister.loadFromRegister
// if even relevant, see how other instructions pan out
var InstructionDefinition =
/*#__PURE__*/
function () {
  function InstructionDefinition(opCode, label) {
    var operations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _classCallCheck(this, InstructionDefinition);

    _defineProperty(this, "opCode", void 0);

    _defineProperty(this, "label", void 0);

    _defineProperty(this, "operations", void 0);

    this.opCode = opCode;
    this.label = label;
    this.operations = operations;
  }

  _createClass(InstructionDefinition, [{
    key: "execute",
    value: function execute(cpu, mmu) {
      this.operations.reduce(function (value, op) {
        var newResult = op.execute(cpu, mmu, value);
        return typeof newResult === "undefined" ? undefined : newResult;
      }, undefined);
      return (0, _lodash.sum)(this.operations.map(function (op) {
        return op.cycles;
      }));
    }
  }, {
    key: "rotateLeftThroughCarry",
    value: function rotateLeftThroughCarry(register) {
      return this.withOperation(new _lowLevel.RotateLeftThroughCarry(register));
    }
  }, {
    key: "internalDelay",
    value: function internalDelay() {
      return this.withOperation(new _lowLevel.InternalDelay());
    }
  }, {
    key: "xOr",
    value: function xOr(register) {
      return this.withOperation(new _lowLevel.XOrRegister(register));
    }
  }, {
    key: "jrCheck",
    value: function jrCheck(flag) {
      return this.withOperation(new _lowLevel.JrCheck(flag));
    }
  }, {
    key: "bitFlags",
    value: function bitFlags(register) {
      return this.withOperation(new _lowLevel.BitFlags(register));
    }
  }, {
    key: "compareToRegister",
    value: function compareToRegister(register) {
      return this.withOperation(new _lowLevel.CompareToRegister(register));
    }
  }, {
    key: "loadRegister",
    value: function loadRegister(register) {
      return this.withOperation(new _lowLevel.LoadRegister(register));
    }
  }, {
    key: "loadProgramCounter",
    value: function loadProgramCounter() {
      return this.loadRegister("pc");
    }
  }, {
    key: "writeMemoryFromOperandAddress",
    value: function writeMemoryFromOperandAddress() {
      return this.withOperation(new _lowLevel.WriteMemoryHighByteFromOperandAddress()).withOperation(new _lowLevel.WriteMemoryLowByteFromOperandAddress()).incrementRegister("pc");
    }
  }, {
    key: "writeMemoryFromRegisterAddress",
    value: function writeMemoryFromRegisterAddress(register) {
      return this.withOperation(new _lowLevel.WriteMemoryFromRegisterAddress(register));
    }
  }, {
    key: "writeMemoryFromGroupedRegisterAddress",
    value: function writeMemoryFromGroupedRegisterAddress(register) {
      return this.withOperation(new _lowLevel.WriteWordFromGroupedRegisterAddress(register));
    }
  }, {
    key: "loadByteOperand",
    value: function loadByteOperand() {
      return this.withOperation(new _lowLevel.LoadOperand());
    }
  }, {
    key: "loadSignedByteOperand",
    value: function loadSignedByteOperand() {
      return this.loadByteOperand().withOperation(new _lowLevel.WordValueToSignedByte());
    }
  }, {
    key: "loadWordOperand",
    value: function loadWordOperand() {
      return this.withOperation(new _lowLevel.LoadWordOperand());
    }
  }, {
    key: "decrementRegister",
    value: function decrementRegister(register) {
      return this.withOperation(new _lowLevel.DecrementRegister(register));
    }
  }, {
    key: "incrementRegister",
    value: function incrementRegister(register) {
      return this.withOperation(new _lowLevel.IncrementRegister(register));
    }
  }, {
    key: "storeInRegister",
    value: function storeInRegister(register) {
      return this.withOperation(new _lowLevel.StoreInRegister(register));
    }
  }, {
    key: "readMemory",
    value: function readMemory() {
      return this.withOperation(new _lowLevel.ReadMemory());
    }
  }, {
    key: "readMemoryWord",
    value: function readMemoryWord() {
      return this.withOperation(new _lowLevel.ReadMemoryWord());
    }
  }, {
    key: "writeByteFromWordOperandAddress",
    value: function writeByteFromWordOperandAddress() {
      return this.withOperation(new _lowLevel.WriteByteFromOperandAddress());
    }
  }, {
    key: "writeWordFromProgramWord",
    value: function writeWordFromProgramWord() {
      return this.withOperation(new _lowLevel.WriteWordFromOperandAddress());
    }
  }, {
    key: "setRegister",
    value: function setRegister(register, address) {
      return this.withOperation(new _lowLevel.SetRegister(register, address));
    }
  }, {
    key: "pushWordToStack",
    value: function pushWordToStack() {
      return this.decrementRegister("sp").decrementRegister("sp").writeMemoryWordFromStackPointer();
    }
  }, {
    key: "writeMemoryWordFromStackPointer",
    value: function writeMemoryWordFromStackPointer() {
      return this.withOperation(new _lowLevel.WriteMemoryWordHighByteFromStackPointer()).withOperation(new _lowLevel.WriteMemoryWordLowByteFromStackPointer());
    }
  }, {
    key: "withOperation",
    value: function withOperation(operation) {
      return new InstructionDefinition(this.opCode, this.label, [].concat(_toConsumableArray(this.operations), [operation]));
    }
  }]);

  return InstructionDefinition;
}();

exports.InstructionDefinition = InstructionDefinition;
//# sourceMappingURL=instructions.js.map