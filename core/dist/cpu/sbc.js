"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSbcAR = void 0;

var _instructions = require("./instructions");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var SbcAR =
/*#__PURE__*/
function () {
  function SbcAR(register) {
    _classCallCheck(this, SbcAR);

    _defineProperty(this, "cycles", 0);

    _defineProperty(this, "register", void 0);

    this.register = register;
  }

  _createClass(SbcAR, [{
    key: "execute",
    value: function execute(cpu) {
      var oldA = cpu.registers.a;
      cpu.registers.a -= cpu.registers[this.register];
      cpu.registers.a -= cpu.registers.f & 0x10 ? 1 : 0;
      cpu.registers.f = cpu.registers.a < 0 ? 0x50 : 0x40;
      cpu.registers.a &= 0xff;

      if (!cpu.registers.a) {
        cpu.registers.f |= 0x80;
      }

      if ((cpu.registers.a ^ cpu.registers[this.register] ^ oldA) & 0x10) {
        cpu.registers.f |= 0x20;
      }
    }
  }]);

  return SbcAR;
}();

var createSbcAR = function createSbcAR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "SBC a,".concat(register), [new SbcAR(register)]);
};

exports.createSbcAR = createSbcAR;
//# sourceMappingURL=sbc.js.map