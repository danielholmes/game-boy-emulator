"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// clock cycles per second 4.19 MHz
// approx 69,905 clock cycles per frame (60 fps)
// = approx 17,476 machine cycles per frame
var CLOCK_SPEED = 4194304;
var CLOCK_CYCLES_PER_MACHINE_CYCLE = 4;

var Device =
/*#__PURE__*/
function () {
  function Device(cpu, gpu, mmu) {
    _classCallCheck(this, Device);

    _defineProperty(this, "cpu", void 0);

    _defineProperty(this, "gpu", void 0);

    _defineProperty(this, "mmu", void 0);

    _defineProperty(this, "_isOn", void 0);

    _defineProperty(this, "nonUsedMs", void 0);

    this.cpu = cpu;
    this.gpu = gpu;
    this.mmu = mmu;
    this._isOn = false;
    this.nonUsedMs = 0;
  }

  _createClass(Device, [{
    key: "insertCartridge",
    value: function insertCartridge(cartridge) {
      if (this.isOn) {
        throw new Error("Can't insert cartridge while on");
      }

      this.mmu.loadCartridge(cartridge);
      console.log("TODO: Cart insert if not present", _typeof(cartridge));
    }
  }, {
    key: "removeCartridge",
    value: function removeCartridge() {
      if (this.isOn) {
        throw new Error("Can't remove cartridge while on");
      }

      console.log("TODO: Cart remove if present");
    }
  }, {
    key: "turnOn",
    value: function turnOn() {
      if (this.isOn) {
        throw new Error("Already on");
      }

      this._isOn = true;
    }
  }, {
    key: "turnOff",
    value: function turnOff() {
      if (!this.isOn) {
        throw new Error("Already off");
      }

      this._isOn = false;
    }
    /**
     * Ticks all components in parallel
     * @param ms
     */

  }, {
    key: "tick",
    value: function tick(ms) {
      if (!this.isOn) {
        throw new Error("Not powered on");
      }

      this.nonUsedMs += ms;
      var numMachineCycles = Math.floor(CLOCK_SPEED / CLOCK_CYCLES_PER_MACHINE_CYCLE * 0.001 * this.nonUsedMs);
      var numClockCycles = numMachineCycles * CLOCK_CYCLES_PER_MACHINE_CYCLE;
      this.nonUsedMs -= numClockCycles / CLOCK_SPEED; // TODO:

      /*
        All are running in parallel so should:
          - each device run for one machine cycle (4 clock cycles)
          - run for number of machine cycles that will fit into ms
          - each device should run up to the current cycles, but never beyond
            - cpu should have everything broken down in to low level operations,
              including instruction fetch
              - each instruction then pushes low level ops on to todo stack
              - low level op can be 4 clock cycles, or 0
              - when todo stack empty, add fetch instruction low level op
       */

      this.cpu.tick(this.mmu, numClockCycles);
      this.gpu.tick(numClockCycles); // TODO: Timer
      // TODO: Interrupts
    }
  }, {
    key: "tickCycle",
    value: function tickCycle() {
      this.cpu.tick(this.mmu, 1);
      this.gpu.tick(1); // TODO: Timer
      // TODO: Interrupts
    }
  }, {
    key: "pressButton",
    value: function pressButton(button) {
      console.log("TODO: pressButton", button);
    }
  }, {
    key: "releaseButton",
    value: function releaseButton(button) {
      console.log("TODO: releaseButton", button);
    }
  }, {
    key: "isOn",
    get: function get() {
      return this._isOn;
    }
  }]);

  return Device;
}();

exports.Device = Device;
//# sourceMappingURL=device.js.map