"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJrN = void 0;

var _instructions = require("./instructions");

var createJrN = function createJrN(opCode, flag) {
  return new _instructions.InstructionDefinition(opCode, "JR ".concat(flag, ",nn")).loadSignedByteOperand().jrCheck(flag);
}; // M = 1: n read: memory access
// ; cc matches or unconditional
// M = 2: internal delay


exports.createJrN = createJrN;
//# sourceMappingURL=jr.js.map