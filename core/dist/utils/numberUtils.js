"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toWordHexString = exports.toByteHexString = exports.toHexString = exports.byteValueToSignedByte = void 0;

var _lodash = require("lodash");

var byteValueToSignedByte = function byteValueToSignedByte(value) {
  if ((value & 0x80) !== 0) {
    return -(~value & 0xff) - 1;
  }

  return value & 0xff;
};

exports.byteValueToSignedByte = byteValueToSignedByte;

var toHex = function toHex(value, length) {
  if (length !== undefined) {
    var maxValue = parseInt((0, _lodash.repeat)("f", length), 16);

    if (value > maxValue) {
      throw new Error("Can't format ".concat(value.toString(16), " in to ").concat(length, " hex digits"));
    }
  }

  var start = value >= 0 ? "" : "-";
  var end = Math.abs(value).toString(16).toLowerCase();

  if (length === undefined) {
    return start + end;
  }

  return "".concat(start).concat((0, _lodash.padStart)(end, length, "0"));
};

var toHexString = function toHexString(value) {
  return toHex(value);
};

exports.toHexString = toHexString;

var toByteHexString = function toByteHexString(value) {
  return toHex(value, 2);
};

exports.toByteHexString = toByteHexString;

var toWordHexString = function toWordHexString(value) {
  return toHex(value, 4);
};

exports.toWordHexString = toWordHexString;
//# sourceMappingURL=numberUtils.js.map