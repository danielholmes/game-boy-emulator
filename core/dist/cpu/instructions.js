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
      })) + 4; // 4 are the cycles from reading the instruction. Perhaps shouldn't actually go here
    }
  }, {
    key: "xOr",
    value: function xOr(register) {
      return this.withOperation(new _lowLevel.XOrRegister(register));
    }
  }, {
    key: "decrementGroupedRegister",
    value: function decrementGroupedRegister(register) {
      return this.withOperation(new _lowLevel.DecrementGroupedRegister(register));
    }
  }, {
    key: "jrCheck",
    value: function jrCheck() {
      return this.withOperation(new _lowLevel.JrCheck());
    }
  }, {
    key: "bitFlags",
    value: function bitFlags(register) {
      return this.withOperation(new _lowLevel.BitFlags(register));
    }
  }, {
    key: "nop",
    value: function nop() {
      return this.withOperation(new _lowLevel.Nop());
    }
  }, {
    key: "loadRegister",
    value: function loadRegister(register) {
      return this.withOperation(new _lowLevel.LoadRegister(register));
    }
  }, {
    key: "loadGroupedRegister",
    value: function loadGroupedRegister(register) {
      return this.withOperation(new _lowLevel.LoadGroupedRegister(register));
    }
  }, {
    key: "writeMemoryFromOperandAddress",
    value: function writeMemoryFromOperandAddress() {
      return this.withOperation(new _lowLevel.WriteMemoryFromOperandAddress());
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
    key: "loadStackPointer",
    value: function loadStackPointer() {
      return this.withOperation(new _lowLevel.LoadStackPointer());
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
    key: "incrementGroupedRegister",
    value: function incrementGroupedRegister(register) {
      return this.withOperation(new _lowLevel.IncrementGroupedRegister(register));
    }
  }, {
    key: "incrementStackPointer",
    value: function incrementStackPointer() {
      return this.withOperation(new _lowLevel.IncrementStackPointer());
    }
  }, {
    key: "storeInRegister",
    value: function storeInRegister(register) {
      return this.withOperation(new _lowLevel.StoreInRegister(register));
    }
  }, {
    key: "storeInGroupedRegister",
    value: function storeInGroupedRegister(register) {
      return this.withOperation(new _lowLevel.StoreInGroupedRegister(register));
    }
  }, {
    key: "storeInStackPointer",
    value: function storeInStackPointer() {
      return this.withOperation(new _lowLevel.StoreInStackPointer());
    }
  }, {
    key: "readMemory",
    value: function readMemory() {
      return this.withOperation(new _lowLevel.ReadMemory());
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
    key: "decrementStackPointer",
    value: function decrementStackPointer(amount) {
      return this.withOperation(new _lowLevel.DecrementStackPointer(amount));
    }
  }, {
    key: "setProgramCounter",
    value: function setProgramCounter(address) {
      return this.withOperation(new _lowLevel.SetProgramCounter(address));
    }
  }, {
    key: "loadProgramCounter",
    value: function loadProgramCounter() {
      return this.withOperation(new _lowLevel.LoadProgramCounter());
    }
  }, {
    key: "writeMemoryFromStackPointer",
    value: function writeMemoryFromStackPointer() {
      return this.withOperation(new _lowLevel.WriteMemoryFromStackPointer());
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