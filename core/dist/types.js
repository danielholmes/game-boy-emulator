"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberToByteBinary = exports.numberToWordHex = exports.numberToByteHex = exports.numberToHex = exports.binaryToNumber = exports.byteValueToSignedByte = exports.BYTE_BIT_POSITIONS = void 0;

var _lodash = require("lodash");

var BYTE_BIT_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7];
exports.BYTE_BIT_POSITIONS = BYTE_BIT_POSITIONS;

var byteValueToSignedByte = function byteValueToSignedByte(value) {
  if ((value & 0x80) !== 0) {
    return -(~value & 0xff) - 1;
  }

  return value & 0xff;
};

exports.byteValueToSignedByte = byteValueToSignedByte;

var binaryToNumber = function binaryToNumber(binary) {
  return parseInt(binary.toString(), 2);
};

exports.binaryToNumber = binaryToNumber;

var toHex = function toHex(value, length) {
  var sign = value >= 0 ? "" : "-";
  var start = "".concat(sign, "0x");
  var end = Math.abs(value).toString(16).toUpperCase();

  if (length === undefined) {
    return start + end;
  }

  return "".concat(start).concat((0, _lodash.padStart)(end, length, "0"));
};

var numberToHex = function numberToHex(value) {
  return toHex(value);
};

exports.numberToHex = numberToHex;

var numberToByteHex = function numberToByteHex(value) {
  return toHex(value, 2);
};

exports.numberToByteHex = numberToByteHex;

var numberToWordHex = function numberToWordHex(value) {
  return toHex(value, 4);
};

exports.numberToWordHex = numberToWordHex;

var numberToByteBinary = function numberToByteBinary(value) {
  return value.toString(2).padStart(8, "0");
};

exports.numberToByteBinary = numberToByteBinary;
//# sourceMappingURL=types.js.map