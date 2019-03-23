"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DecrementRegister = exports.DecrementByteRegisterWithFlags = exports.XOrRegister = exports.IncrementRegister = exports.IncrementByteRegisterWithFlags = exports.IncrementWordRegisterWithFlags = exports.LoadWordOperandHighByte = exports.LoadOperand = exports.SetRegister = exports.WriteMemoryWordLowByteFromStackPointer = exports.WriteMemoryWordHighByteFromStackPointer = exports.InternalDelay = exports.WriteMemoryFromRegisterAddress = exports.WriteMemoryLowByteFromOperandAddress = exports.WriteMemoryHighByteFromOperandAddress = exports.StoreInRegister = exports.WriteWordFromOperandAddress = exports.WriteByteFromOperandAddress = exports.ByteValueToSignedByte = exports.JrCheck = exports.JR_FLAGS = exports.BitFlags = exports.ReadMemory = exports.ReadMemoryWord = exports.RotateLeftThroughCarry = exports.CompareToRegister = exports.LoadRegister = void 0;

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

var CompareToRegister =
/*#__PURE__*/
function () {
  function CompareToRegister(register) {
    _classCallCheck(this, CompareToRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(CompareToRegister, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("Undefined value");
      }

      var previous = cpu.registers[this.register];
      var next = previous - value;
      cpu.registers.setFFromParts(next === 0x00, 1, (previous & 0xf) - (value & 0xf) < 0, next < 0);
      return next;
    }
  }]);

  return CompareToRegister;
}();

exports.CompareToRegister = CompareToRegister;

var RotateLeftThroughCarry =
/*#__PURE__*/
function () {
  function RotateLeftThroughCarry(register) {
    _classCallCheck(this, RotateLeftThroughCarry);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(RotateLeftThroughCarry, [{
    key: "execute",
    value: function execute(cpu) {
      var newFC = (cpu.registers[this.register] & 1 << 7) !== 0 ? 1 : 0;
      var newValue = (cpu.registers[this.register] << 1) + cpu.registers.fC;
      cpu.registers[this.register] = newValue;
      var newF = 0x00;

      if (newFC === 1) {
        newF |= _registers.FLAG_C_MASK;
      } else {
        newF &= ~_registers.FLAG_C_MASK;
      }

      if (newValue === 0) {
        newF |= _registers.FLAG_Z_MASK;
      }

      cpu.registers.f = newF;
    }
  }]);

  return RotateLeftThroughCarry;
}();

exports.RotateLeftThroughCarry = RotateLeftThroughCarry;

var ReadMemoryWord =
/*#__PURE__*/
function () {
  function ReadMemoryWord() {
    _classCallCheck(this, ReadMemoryWord);

    _defineProperty(this, "cycles", 8);
  }

  _createClass(ReadMemoryWord, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return mmu.readBigEndianWord(value);
    }
  }]);

  return ReadMemoryWord;
}();

exports.ReadMemoryWord = ReadMemoryWord;

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

var BitFlags =
/*#__PURE__*/
function () {
  function BitFlags(position) {
    _classCallCheck(this, BitFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "position", void 0);

    this.position = position;
  }

  _createClass(BitFlags, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var bit = value & 1 << this.position;
      cpu.registers.fZ = bit === 0 ? 1 : 0;
      cpu.registers.fN = 0;
      cpu.registers.fH = 1;
    }
  }]);

  return BitFlags;
}();

exports.BitFlags = BitFlags;
var JR_FLAGS = ["fNz", "fZ", "fC", "fNc"];
exports.JR_FLAGS = JR_FLAGS;

var JrCheck =
/*#__PURE__*/
function () {
  function JrCheck(flag) {
    _classCallCheck(this, JrCheck);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "flag", void 0);

    this.flag = flag;
  }

  _createClass(JrCheck, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      if (this.flag) {
        // TODO: Becomes a longer cycle operation, in internal
        cpu.registers.pc += value;
      }
    }
  }]);

  return JrCheck;
}();

exports.JrCheck = JrCheck;

var ByteValueToSignedByte =
/*#__PURE__*/
function () {
  function ByteValueToSignedByte() {
    _classCallCheck(this, ByteValueToSignedByte);

    _defineProperty(this, "cycles", 0);
  }

  _createClass(ByteValueToSignedByte, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      return (0, _types.byteValueToSignedByte)(value);
    }
  }]);

  return ByteValueToSignedByte;
}();
/**
 * @deprecated should be split
 */


exports.ByteValueToSignedByte = ByteValueToSignedByte;

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
/**
 * @deprecated should be split
 */


exports.WriteByteFromOperandAddress = WriteByteFromOperandAddress;

var WriteWordFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteWordFromOperandAddress() {
    _classCallCheck(this, WriteWordFromOperandAddress);

    _defineProperty(this, "cycles", 16);
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

var WriteMemoryHighByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteMemoryHighByteFromOperandAddress() {
    _classCallCheck(this, WriteMemoryHighByteFromOperandAddress);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryHighByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var operand = mmu.readByte(cpu.registers.pc);
      mmu.writeByte(0xff00 + operand + 1, value >> 8);
      return value;
    }
  }]);

  return WriteMemoryHighByteFromOperandAddress;
}();

exports.WriteMemoryHighByteFromOperandAddress = WriteMemoryHighByteFromOperandAddress;

var WriteMemoryLowByteFromOperandAddress =
/*#__PURE__*/
function () {
  function WriteMemoryLowByteFromOperandAddress() {
    _classCallCheck(this, WriteMemoryLowByteFromOperandAddress);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryLowByteFromOperandAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var operand = mmu.readByte(cpu.registers.pc);
      mmu.writeByte(0xff00 + operand, value & 255);
      return value;
    }
  }]);

  return WriteMemoryLowByteFromOperandAddress;
}();

exports.WriteMemoryLowByteFromOperandAddress = WriteMemoryLowByteFromOperandAddress;

var WriteMemoryFromRegisterAddress =
/*#__PURE__*/
function () {
  function WriteMemoryFromRegisterAddress(register) {
    var add = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0x0000;

    _classCallCheck(this, WriteMemoryFromRegisterAddress);

    _defineProperty(this, "cycles", 4);

    _defineProperty(this, "register", void 0);

    _defineProperty(this, "add", void 0);

    this.register = register;
    this.add = add;
  }

  _createClass(WriteMemoryFromRegisterAddress, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeByte(cpu.registers[this.register] + this.add, value);
    }
  }]);

  return WriteMemoryFromRegisterAddress;
}();

exports.WriteMemoryFromRegisterAddress = WriteMemoryFromRegisterAddress;

var InternalDelay =
/*#__PURE__*/
function () {
  function InternalDelay() {
    _classCallCheck(this, InternalDelay);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(InternalDelay, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      return value;
    }
  }]);

  return InternalDelay;
}();

exports.InternalDelay = InternalDelay;

var WriteMemoryWordHighByteFromStackPointer =
/*#__PURE__*/
function () {
  function WriteMemoryWordHighByteFromStackPointer() {
    _classCallCheck(this, WriteMemoryWordHighByteFromStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryWordHighByteFromStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeByte(cpu.registers.sp + 1, value >> 8);
      return value;
    }
  }]);

  return WriteMemoryWordHighByteFromStackPointer;
}();

exports.WriteMemoryWordHighByteFromStackPointer = WriteMemoryWordHighByteFromStackPointer;

var WriteMemoryWordLowByteFromStackPointer =
/*#__PURE__*/
function () {
  function WriteMemoryWordLowByteFromStackPointer() {
    _classCallCheck(this, WriteMemoryWordLowByteFromStackPointer);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(WriteMemoryWordLowByteFromStackPointer, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      mmu.writeByte(cpu.registers.sp, value & 255);
      return value;
    }
  }]);

  return WriteMemoryWordLowByteFromStackPointer;
}();

exports.WriteMemoryWordLowByteFromStackPointer = WriteMemoryWordLowByteFromStackPointer;

var SetRegister =
/*#__PURE__*/
function () {
  function SetRegister(register, value) {
    _classCallCheck(this, SetRegister);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    _defineProperty(this, "value", void 0);

    this.register = register;
    this.value = value;
  }

  _createClass(SetRegister, [{
    key: "execute",
    value: function execute(cpu) {
      cpu.registers[this.register] = this.value;
    }
  }]);

  return SetRegister;
}();

exports.SetRegister = SetRegister;

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

var LoadWordOperandHighByte =
/*#__PURE__*/
function () {
  function LoadWordOperandHighByte() {
    _classCallCheck(this, LoadWordOperandHighByte);

    _defineProperty(this, "cycles", 4);
  }

  _createClass(LoadWordOperandHighByte, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      if (value === undefined) {
        throw new Error("value undefined");
      }

      var byte = mmu.readByte(cpu.registers.pc);
      cpu.registers.pc++;
      return (byte << 8) + value;
    }
  }]);

  return LoadWordOperandHighByte;
}();

exports.LoadWordOperandHighByte = LoadWordOperandHighByte;

var IncrementWordRegisterWithFlags =
/*#__PURE__*/
function () {
  function IncrementWordRegisterWithFlags(register) {
    _classCallCheck(this, IncrementWordRegisterWithFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(IncrementWordRegisterWithFlags, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      cpu.registers.setFHFromWordAdd(cpu.registers[this.register], 1);
      cpu.registers[this.register]++;
      cpu.registers.fZ = cpu.registers[this.register] === 0x0000 ? 1 : 0;
      cpu.registers.fN = 0;
      return value;
    }
  }]);

  return IncrementWordRegisterWithFlags;
}();

exports.IncrementWordRegisterWithFlags = IncrementWordRegisterWithFlags;

var IncrementByteRegisterWithFlags =
/*#__PURE__*/
function () {
  function IncrementByteRegisterWithFlags(register) {
    _classCallCheck(this, IncrementByteRegisterWithFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(IncrementByteRegisterWithFlags, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      cpu.registers.setFHFromByteAdd(cpu.registers[this.register], 1);
      cpu.registers[this.register]++;
      cpu.registers.fZ = cpu.registers[this.register] === 0x00 ? 1 : 0;
      cpu.registers.fN = 0;
      return value;
    }
  }]);

  return IncrementByteRegisterWithFlags;
}();

exports.IncrementByteRegisterWithFlags = IncrementByteRegisterWithFlags;

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
    value: function execute(cpu, mmu, value) {
      cpu.registers[this.register]++;
      return value;
    }
  }]);

  return IncrementRegister;
}();

exports.IncrementRegister = IncrementRegister;

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
      cpu.registers.a ^= cpu.registers[this.register];
      cpu.registers.f = cpu.registers.a ? 0x00 : XOrRegister.F_Z_SET;
    }
  }]);

  return XOrRegister;
}();

exports.XOrRegister = XOrRegister;

_defineProperty(XOrRegister, "F_Z_SET", (0, _types.binaryToNumber)("10000000"));

var DecrementByteRegisterWithFlags =
/*#__PURE__*/
function () {
  function DecrementByteRegisterWithFlags(register) {
    _classCallCheck(this, DecrementByteRegisterWithFlags);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(DecrementByteRegisterWithFlags, [{
    key: "execute",
    value: function execute(cpu, mmu, value) {
      cpu.registers.setFHFromByteSubtract(cpu.registers[this.register], 1);
      cpu.registers[this.register]--;
      cpu.registers.fZ = cpu.registers[this.register] === 0x00 ? 1 : 0;
      cpu.registers.fN = 1;
      return value;
    }
  }]);

  return DecrementByteRegisterWithFlags;
}();

exports.DecrementByteRegisterWithFlags = DecrementByteRegisterWithFlags;

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
    value: function execute(cpu, mmu, value) {
      cpu.registers[this.register]--;
      return value;
    }
  }]);

  return DecrementRegister;
}();

exports.DecrementRegister = DecrementRegister;
//# sourceMappingURL=lowLevel.js.map