"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CpuRegistersImpl = exports.calculateFHFromByteAdd = exports.FLAG_C_MASK = exports.FLAG_H_MASK = exports.FLAG_N_MASK = exports.FLAG_Z_MASK = exports.FLAG_Z_BIT = exports.BYTE_REGISTER_PAIR_PERMUTATIONS = exports.NON_A_BYTE_REGISTERS = exports.GROUPED_WORD_REGISTERS = exports.NON_AF_GROUPED_WORD_REGISTERS = exports.isWordRegister = exports.isByteRegister = exports.BYTE_REGISTERS = void 0;

var _lodash = require("lodash");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BYTE_REGISTERS = ["a", "b", "c", "d", "e", "h", "l"];
exports.BYTE_REGISTERS = BYTE_REGISTERS;
var BYTE_REGISTER_STRINGS = new Set(["a", "b", "c", "d", "e", "h", "l"]);

var isByteRegister = function isByteRegister(name) {
  return BYTE_REGISTER_STRINGS.has(name);
};

exports.isByteRegister = isByteRegister;
var WORD_REGISTER_STRINGS = new Set(["af", "bc", "de", "hl", "sp", "pc"]);

var isWordRegister = function isWordRegister(name) {
  return WORD_REGISTER_STRINGS.has(name);
};

exports.isWordRegister = isWordRegister;
var NON_AF_GROUPED_WORD_REGISTERS = ["bc", "de", "hl"];
exports.NON_AF_GROUPED_WORD_REGISTERS = NON_AF_GROUPED_WORD_REGISTERS;
var GROUPED_WORD_REGISTERS = ["af"].concat(NON_AF_GROUPED_WORD_REGISTERS);
exports.GROUPED_WORD_REGISTERS = GROUPED_WORD_REGISTERS;
var NON_A_BYTE_REGISTERS = BYTE_REGISTERS.filter(function (r) {
  return r !== "a";
});
exports.NON_A_BYTE_REGISTERS = NON_A_BYTE_REGISTERS;
var BYTE_REGISTER_PAIR_PERMUTATIONS = (0, _lodash.flatMap)(BYTE_REGISTERS.map(function (r1) {
  return BYTE_REGISTERS.map(function (r2) {
    return [r1, r2];
  });
})); // TODO: Shouldn't be exported, find a way to encapsulate this

exports.BYTE_REGISTER_PAIR_PERMUTATIONS = BYTE_REGISTER_PAIR_PERMUTATIONS;
var FLAG_Z_BIT = 7;
exports.FLAG_Z_BIT = FLAG_Z_BIT;
var FLAG_N_BIT = 6;
var FLAG_H_BIT = 5;
var FLAG_C_BIT = 4;
var FLAG_Z_MASK = 1 << FLAG_Z_BIT;
exports.FLAG_Z_MASK = FLAG_Z_MASK;
var FLAG_N_MASK = 1 << FLAG_N_BIT;
exports.FLAG_N_MASK = FLAG_N_MASK;
var FLAG_H_MASK = 1 << FLAG_H_BIT;
exports.FLAG_H_MASK = FLAG_H_MASK;
var FLAG_C_MASK = 1 << FLAG_C_BIT;
exports.FLAG_C_MASK = FLAG_C_MASK;

var calculateFHFromByteAdd = function calculateFHFromByteAdd(original, add) {
  return ((original & 0xf) + (add & 0xf) & 0x10) === 0x10 ? 1 : 0;
};

exports.calculateFHFromByteAdd = calculateFHFromByteAdd;

var CpuRegistersImpl =
/*#__PURE__*/
function () {
  // Idea, if store all these in uint8array instead then will do & 0xff
  // "for free". Do some performance checks on it
  function CpuRegistersImpl() {
    _classCallCheck(this, CpuRegistersImpl);

    _defineProperty(this, "_a", void 0);

    _defineProperty(this, "_b", void 0);

    _defineProperty(this, "_c", void 0);

    _defineProperty(this, "_d", void 0);

    _defineProperty(this, "_e", void 0);

    _defineProperty(this, "_h", void 0);

    _defineProperty(this, "_l", void 0);

    _defineProperty(this, "_f", void 0);

    _defineProperty(this, "_pc", void 0);

    _defineProperty(this, "_sp", void 0);

    this._a = 0x00;
    this._b = 0x00;
    this._c = 0x00;
    this._d = 0x00;
    this._e = 0x00;
    this._h = 0x00;
    this._l = 0x00;
    this._f = 0x0000;
    this._pc = 0x0000;
    this._sp = 0xffff;
  }

  _createClass(CpuRegistersImpl, [{
    key: "setFFromParts",
    value: function setFFromParts(z, n, h, c) {
      this._f = (z ? FLAG_Z_MASK : 0) + (n ? FLAG_N_MASK : 0) + (h ? FLAG_H_MASK : 0) + (c ? FLAG_C_MASK : 0);
    }
  }, {
    key: "setFHFromByteAdd",
    value: function setFHFromByteAdd(original, add) {
      this.fH = calculateFHFromByteAdd(original, add);
    }
  }, {
    key: "setFHFromWordAdd",
    value: function setFHFromWordAdd(original, add) {
      this.fH = ((original & 0xff) + (add & 0xff) & 0x100) === 0x100 ? 1 : 0;
    }
  }, {
    key: "setFHFromByteSubtract",
    value: function setFHFromByteSubtract(original, subtract) {
      if (subtract !== 1) {
        throw new Error("Not impl");
      }

      this.fH = (original & 0xf) === 0 ? 1 : 0;
    }
  }, {
    key: "setFHFromWordSubtract",
    value: function setFHFromWordSubtract(original, subtract) {
      if (subtract !== 1) {
        throw new Error("Not impl");
      }

      this.fH = (original & 0xff) === 0 ? 1 : 0;
    }
  }, {
    key: "fNz",
    get: function get() {
      return this.fZ ? 0 : 1;
    },
    set: function set(value) {
      this.fZ = value ? 0 : 1;
    }
  }, {
    key: "fZ",
    get: function get() {
      return (this.f & FLAG_Z_MASK) !== 0 ? 1 : 0;
    },
    set: function set(value) {
      if (value === 1) {
        this.f |= FLAG_Z_MASK;
        return;
      }

      this.f &= ~FLAG_Z_MASK;
    }
  }, {
    key: "fN",
    get: function get() {
      return (this.f & FLAG_N_MASK) !== 0 ? 1 : 0;
    },
    set: function set(value) {
      if (value === 1) {
        this.f |= FLAG_N_MASK;
        return;
      }

      this.f &= ~FLAG_N_MASK;
    }
  }, {
    key: "fH",
    get: function get() {
      return (this.f & FLAG_H_MASK) !== 0 ? 1 : 0;
    },
    set: function set(value) {
      if (value === 1) {
        this.f |= FLAG_H_MASK;
        return;
      }

      this.f &= ~FLAG_H_MASK;
    }
  }, {
    key: "fC",
    get: function get() {
      return (this.f & FLAG_C_MASK) !== 0 ? 1 : 0;
    },
    set: function set(value) {
      if (value === 1) {
        this.f |= FLAG_C_MASK;
        return;
      }

      this.f &= ~FLAG_C_MASK;
    }
  }, {
    key: "fNc",
    get: function get() {
      return this.fC ? 0 : 1;
    },
    set: function set(value) {
      this.fC = value ? 0 : 1;
    }
  }, {
    key: "a",
    set: function set(value) {
      this._a = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._a;
    }
  }, {
    key: "b",
    set: function set(value) {
      this._b = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._b;
    }
  }, {
    key: "c",
    set: function set(value) {
      this._c = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._c;
    }
  }, {
    key: "d",
    set: function set(value) {
      this._d = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._d;
    }
  }, {
    key: "e",
    set: function set(value) {
      this._e = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._e;
    }
  }, {
    key: "h",
    set: function set(value) {
      this._h = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._h;
    }
  }, {
    key: "l",
    set: function set(value) {
      this._l = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._l;
    }
  }, {
    key: "f",
    set: function set(value) {
      this._f = value & 0xff; // Mask to 8 bits
    },
    get: function get() {
      return this._f;
    }
  }, {
    key: "pc",
    set: function set(value) {
      this._pc = value & 0xffff; // Mask to 16 bits
    },
    get: function get() {
      return this._pc;
    }
  }, {
    key: "sp",
    set: function set(value) {
      this._sp = value & 0xffff; // Mask to 16 bits
    },
    get: function get() {
      return this._sp;
    }
  }, {
    key: "bc",
    set: function set(value) {
      this._b = value >> 8 & 0xff;
      this._c = value & 0xff;
    },
    get: function get() {
      return (this._b << 8) + this._c;
    }
  }, {
    key: "de",
    set: function set(value) {
      this._d = value >> 8 & 0xff;
      this._e = value & 0xff;
    },
    get: function get() {
      return (this._d << 8) + this._e;
    }
  }, {
    key: "af",
    set: function set(value) {
      this._a = value >> 8 & 0xff;
      this._f = value & 0xff;
    },
    get: function get() {
      return (this._a << 8) + this._f;
    }
  }, {
    key: "hl",
    set: function set(value) {
      this._h = value >> 8 & 0xff;
      this._l = value & 0xff;
    },
    get: function get() {
      return (this._h << 8) + this._l;
    }
  }]);

  return CpuRegistersImpl;
}();

exports.CpuRegistersImpl = CpuRegistersImpl;
//# sourceMappingURL=registers.js.map