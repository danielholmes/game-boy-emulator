"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createXorR = void 0;

var _instructions = require("./instructions");

var createXorR = function createXorR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "XOR ".concat(register)).xOr(register);
};

exports.createXorR = createXorR;
//# sourceMappingURL=xor.js.map