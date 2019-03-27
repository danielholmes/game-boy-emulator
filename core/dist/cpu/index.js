"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cpu = void 0;

var _registers = require("./registers");

var _opCodesMap = _interopRequireDefault(require("./opCodesMap"));

var _numberUtils = require("../utils/numberUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// const CLOCK_CYCLES_PER_MACHINE_CYCLE = 4;
var Cpu =
/*#__PURE__*/
function () {
  // TODO: public should be readonly version
  // Temporary variable until refactor done
  function Cpu() {
    _classCallCheck(this, Cpu);

    _defineProperty(this, "registers", void 0);

    _defineProperty(this, "remainingCycles", void 0);

    _defineProperty(this, "_currentInstructionPc", void 0);

    this.registers = new _registers.CpuRegistersImpl();
    this.remainingCycles = 0;
  }

  _createClass(Cpu, [{
    key: "getInstructionLabel",
    value: function getInstructionLabel(opCode) {
      var instruction = _opCodesMap.default[opCode];

      if (!instruction) {
        throw new Error("No instruction with opCode ".concat((0, _numberUtils.toByteHexString)(opCode)));
      }

      return instruction.label;
    } // TODO: See device comments for changes

  }, {
    key: "tick",
    value: function tick(mmu, cycles) {
      this.remainingCycles += cycles; // Note: that this currently goes below 0 which is a no no. Should only
      // simulate up to current available cycles. This will be achieved when all
      // instructions are specified in 4 cycle chunks

      while (this.remainingCycles > 4) {
        this.tickCycle(mmu);
      }
    }
  }, {
    key: "tickCycle",
    value: function tickCycle(mmu) {
      // TODO: Convert to low level
      var opCode = mmu.readByte(this.registers.pc);
      this.remainingCycles -= 4;
      var instruction = _opCodesMap.default[opCode];

      if (!instruction) {
        throw new Error("No instruction for opCode ".concat((0, _numberUtils.toByteHexString)(opCode), " reading from pc ").concat((0, _numberUtils.toByteHexString)(this.registers.pc)));
      }

      this.registers.pc++;
      this.remainingCycles -= instruction.execute(this, mmu); // detect interrupt
      // Remembers its current state;
      // I Jumps (sets the PC) to the address of the interrupt handler.
      //   I Executes the interrupt handler code, which ends with a special
      // RETI (Return From Interrupt) instruction, which restores state.
      // I If multiple interrupts are detected, the one with the highest
      // priority is handled first.
      // The processor also has an Interrupt Master Enable (IME) switch,
      // which allows it to completely deactivate interrupt handling
      // (this is done during e.g. processing an interrupt, because we
      // should not handle two of them at the same time).
    }
  }, {
    key: "currentInstructionPc",
    get: function get() {
      if (this._currentInstructionPc === undefined) {
        return this.registers.pc;
      }

      return this._currentInstructionPc;
    }
  }]);

  return Cpu;
}();

exports.Cpu = Cpu;
//# sourceMappingURL=index.js.map