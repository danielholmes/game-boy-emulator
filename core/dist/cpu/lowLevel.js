"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DecrementGroupedRegister = exports.DecrementRegister = exports.LoadStackPointer = exports.IncrementStackPointer = exports.Nop = exports.XOrRegister = exports.IncrementGroupedRegister = exports.IncrementRegister = exports.LoadWordOperand = exports.LoadOperand = exports.SetProgramCounter = exports.StoreInStackPointer = exports.WriteMemoryWordFromStackPointer = exports.WriteMemoryFromRegisterAddress = exports.WriteMemoryFromOperandAddress = exports.LoadProgramCounter = exports.DecrementStackPointer = exports.StoreInGroupedRegister = exports.StoreInRegister = exports.WriteWordFromOperandAddress = exports.WriteByteFromOperandAddress = exports.WordValueToSignedByte = exports.JrCheck = exports.BitFlags = exports.WriteWordFromGroupedRegisterAddress = exports.LoadGroupedRegister = exports.ReadMemory = exports.LoadRegister = void 0;

var _registers = require("./registers");

var _types = require("../types");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LoadRegister =
/*#__PURE__*/
function () {
  function LoadRegister(register) {
    _classCallCheck(this, LoadRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(LoadRegister, [{
    key: "execute",
    value: function execute(cpu) {
      return cpu.registers[this.register];
    }
  }]);

  return LoadRegister;
}();

exports.LoadRegister = LoadRegister;

var ReadMemory =
/*#__PURE__*/
function () {
  function ReadMemory() {
    _classCallCheck(this, ReadMemory);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(ReadMemory, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return mmu.readByte(value);
    }
  }]);

  return ReadMemory;
}();

exports.ReadMemory = ReadMemory;

var LoadGroupedRegister =
/*#__PURE__*/
function () {
  function LoadGroupedRegister(register) {
    _classCallCheck(this, LoadGroupedRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(LoadGroupedRegister, [{
    key: "execute",
    value: function execute(cpu) {
      return cpu.registers[this.register];
    }
  }]);

  return LoadGroupedRegister;
}();

exports.LoadGroupedRegister = LoadGroupedRegister;

var WriteWordFromGroupedRegisterAddress =
/*#__PURE__*/
function () {
  function WriteWordFromGroupedRegisterAddress(register) {
    _classCallCheck(this, WriteWordFromGroupedRegisterAddress);

    _defineProperty(this, "cycles", 4);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(WriteWordFromGroupedRegisterAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = cpu.registers[this.register];
      mmu.writeByte(address, value);
    }
  }]);

  return WriteWordFromGroupedRegisterAddress;
}();

exports.WriteWordFromGroupedRegisterAddress = WriteWordFromGroupedRegisterAddress;

var BitFlags =
/*#__PURE__*/
function () {
  function BitFlags(register) {
    _classCallCheck(this, BitFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(BitFlags, [{
    key: "execute",
    value: function execute(cpu) {
      var t = cpu.registers[this.register] & _registers.FLAG_Z_MASK;
      var flag = 0x20 + (((t & 0xff) === 0 ? 1 : 0) << _registers.FLAG_Z);
      cpu.registers.f &= 0x10;
      cpu.registers.f |= flag;
    }
  }]);

  return BitFlags;
}();

exports.BitFlags = BitFlags;

var JrCheck =
/*#__PURE__*/
function () {
  function JrCheck() {
    _classCallCheck(this, JrCheck);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(JrCheck, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      if (cpu.registers.fNz) {
        // TODO: Becomes a longer cycle operation
        cpu.registers.pc += value;
      }
    }
  }]);

  return JrCheck;
}();

exports.JrCheck = JrCheck;

var WordValueToSignedByte =
/*#__PURE__*/
function () {
  function WordValueToSignedByte() {
    _classCallCheck(this, WordValueToSignedByte);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(WordValueToSignedByte, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return (0, _types.byteValueToSignedByte)(value);
    }
  }]);

  return WordValueToSignedByte;
}();

exports.WordValueToSignedByte = WordValueToSignedByte;

var WriteByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteByteFromOperandAddress() {
    _classCallCheck(this, WriteByteFromOperandAddress);

    _defineProperty(this, "cycles", 12);
  }

  _createClass(WriteByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = mmu.readBigEndianWord(cpu.registers.pc);
      mmu.writeByte(address, value);
      cpu.registers.pc += 2;
    }
  }]);

  return WriteByteFromOperandAddress;
}();

exports.WriteByteFromOperandAddress = WriteByteFromOperandAddress;

var WriteWordFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteWordFromOperandAddress() {
    _classCallCheck(this, WriteWordFromOperandAddress);

    _defineProperty(this, "cycles", 12);
  }

  _createClass(WriteWordFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var address = mmu.readBigEndianWord(cpu.registers.pc);
      mmu.writeWordBigEndian(address, value);
      cpu.registers.pc += 2;
    }
  }]);

  return WriteWordFromOperandAddress;
}();

exports.WriteWordFromOperandAddress = WriteWordFromOperandAddress;

var StoreInRegister =
/*#__PURE__*/
function () {
  function StoreInRegister(register) {
    _classCallCheck(this, StoreInRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(StoreInRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value not defined");
      }

      cpu.registers[this.register] = value;
    }
  }]);

  return StoreInRegister;
}();

exports.StoreInRegister = StoreInRegister;

var StoreInGroupedRegister =
/*#__PURE__*/
function () {
  function StoreInGroupedRegister(register) {
    _classCallCheck(this, StoreInGroupedRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(StoreInGroupedRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value not defined");
      }

      cpu.registers[this.register] = value;
    }
  }]);

  return StoreInGroupedRegister;
}();

exports.StoreInGroupedRegister = StoreInGroupedRegister;

var DecrementStackPointer =
/*#__PURE__*/
function () {
  function DecrementStackPointer(amount) {
    _classCallCheck(this, DecrementStackPointer);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "amount", void 0);

    this.amount = amount;
  }

  _createClass(DecrementStackPointer, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers.sp -= this.amount;
    }
  }]);

  return DecrementStackPointer;
}();

exports.DecrementStackPointer = DecrementStackPointer;

var LoadProgramCounter =
/*#__PURE__*/
function () {
  function LoadProgramCounter() {
    _classCallCheck(this, LoadProgramCounter);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadProgramCounter, [{
    key: "execute",
    value: function execute(cpu) {
      return cpu.registers.pc;
    }
  }]);

  return LoadProgramCounter;
}();

exports.LoadProgramCounter = LoadProgramCounter;

var WriteMemoryFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteMemoryFromOperandAddress() {
    _classCallCheck(this, WriteMemoryFromOperandAddress);

    _defineProperty(this, "cycles", 8);
  }

  _createClass(WriteMemoryFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var operand = mmu.readByte(cpu.registers.pc);
      mmu.writeWordBigEndian(0xff00 + operand, value);
      cpu.registers.pc++;
    }
  }]);

  return WriteMemoryFromOperandAddress;
}();

exports.WriteMemoryFromOperandAddress = WriteMemoryFromOperandAddress;

var WriteMemoryFromRegisterAddress =
/*#__PURE__*/
function () {
  function WriteMemoryFromRegisterAddress(register) {
    _classCallCheck(this, WriteMemoryFromRegisterAddress);

    _defineProperty(this, "cycles", 4);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(WriteMemoryFromRegisterAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeWordBigEndian(0xff00 + cpu.registers[this.register], value);
    }
  }]);

  return WriteMemoryFromRegisterAddress;
}();

exports.WriteMemoryFromRegisterAddress = WriteMemoryFromRegisterAddress;

var WriteMemoryWordFromStackPointer =
/*#__PURE__*/
function () {
  function WriteMemoryWordFromStackPointer() {
    _classCallCheck(this, WriteMemoryWordFromStackPointer);

    _defineProperty(this, "cycles", 8);
  }

  _createClass(WriteMemoryWordFromStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeWordBigEndian(cpu.registers.sp, value);
    }
  }]);

  return WriteMemoryWordFromStackPointer;
}();

exports.WriteMemoryWordFromStackPointer = WriteMemoryWordFromStackPointer;

var StoreInStackPointer =
/*#__PURE__*/
function () {
  function StoreInStackPointer() {
    _classCallCheck(this, StoreInStackPointer);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(StoreInStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value not defined");
      }

      cpu.registers.sp = value;
    }
  }]);

  return StoreInStackPointer;
}();

exports.StoreInStackPointer = StoreInStackPointer;

var SetProgramCounter =
/*#__PURE__*/
function () {
  function SetProgramCounter(value) {
    _classCallCheck(this, SetProgramCounter);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "value", void 0);

    this.value = value;
  }

  _createClass(SetProgramCounter, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers.pc = this.value;
    }
  }]);

  return SetProgramCounter;
}(); // TODO: Can be done in terms of lower level ops


exports.SetProgramCounter = SetProgramCounter;

var LoadOperand =
/*#__PURE__*/
function () {
  function LoadOperand() {
    _classCallCheck(this, LoadOperand);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadOperand, [{
    key: "execute",
    value: function execute(cpu, mmu) {
      var byte = mmu.readByte(cpu.registers.pc);
      cpu.registers.pc++;
      return byte;
    }
  }]);

  return LoadOperand;
}();

exports.LoadOperand = LoadOperand;

var LoadWordOperand =
/*#__PURE__*/
function () {
  function LoadWordOperand() {
    _classCallCheck(this, LoadWordOperand);

    _defineProperty(this, "cycles", 8);
  }

  _createClass(LoadWordOperand, [{
    key: "execute",
    value: function execute(cpu, mmu) {
      var byte = mmu.readBigEndianWord(cpu.registers.pc);
      cpu.registers.pc += 2;
      return byte;
    }
  }]);

  return LoadWordOperand;
}();

exports.LoadWordOperand = LoadWordOperand;

var IncrementRegister =
/*#__PURE__*/
function () {
  function IncrementRegister(register) {
    _classCallCheck(this, IncrementRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(IncrementRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register]++;
    }
  }]);

  return IncrementRegister;
}();

exports.IncrementRegister = IncrementRegister;

var IncrementGroupedRegister =
/*#__PURE__*/
function () {
  function IncrementGroupedRegister(register) {
    _classCallCheck(this, IncrementGroupedRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(IncrementGroupedRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register]++;
    }
  }]);

  return IncrementGroupedRegister;
}();

exports.IncrementGroupedRegister = IncrementGroupedRegister;

var XOrRegister =
/*#__PURE__*/
function () {
  function XOrRegister(register) {
    _classCallCheck(this, XOrRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(XOrRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers.a = cpu.registers[this.register] & 0xff;
      cpu.registers.f = cpu.registers.a ? 0x00 : 0x80;
    }
  }]);

  return XOrRegister;
}();

exports.XOrRegister = XOrRegister;

var Nop =
/*#__PURE__*/
function () {
  function Nop() {
    _classCallCheck(this, Nop);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(Nop, [{
    key: "execute",
    value: function execute() {}
  }]);

  return Nop;
}();

exports.Nop = Nop;

var IncrementStackPointer =
/*#__PURE__*/
function () {
  function IncrementStackPointer() {
    _classCallCheck(this, IncrementStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(IncrementStackPointer, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers.sp++;
    }
  }]);

  return IncrementStackPointer;
}();

exports.IncrementStackPointer = IncrementStackPointer;

var LoadStackPointer =
/*#__PURE__*/
function () {
  function LoadStackPointer() {
    _classCallCheck(this, LoadStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadStackPointer, [{
    key: "execute",
    value: function execute(cpu) {
      return cpu.registers.sp;
    }
  }]);

  return LoadStackPointer;
}();

exports.LoadStackPointer = LoadStackPointer;

var DecrementRegister =
/*#__PURE__*/
function () {
  function DecrementRegister(register) {
    _classCallCheck(this, DecrementRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(DecrementRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register]--;
    }
  }]);

  return DecrementRegister;
}(); // TODO: Depending on cycles, make this WordRegister


exports.DecrementRegister = DecrementRegister;

var DecrementGroupedRegister =
/*#__PURE__*/
function () {
  function DecrementGroupedRegister(register) {
    _classCallCheck(this, DecrementGroupedRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(DecrementGroupedRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register]--;
    }
  }]);

  return DecrementGroupedRegister;
}();

exports.DecrementGroupedRegister = DecrementGroupedRegister;
//# sourceMappingURL=lowLevel.js.map