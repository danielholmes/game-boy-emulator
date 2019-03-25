"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJrN = exports.createJrCcN = void 0;

var _instructions = require("./instructions");

var createJrCcN = function createJrCcN(opCode, flag) {
  return new _instructions.InstructionDefinition(opCode, "JR ".concat(flag, ",n")).loadSignedByteOperand().addToPcIfFlag(flag);
}; // M = 1: n read: memory access
// ; cc matches or unconditional
// M = 2: internal delay


exports.createJrCcN = createJrCcN;

var createJrN = function createJrN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "JR n").loadSignedByteOperand().addToRegister("pc");
};

exports.createJrN = createJrN;
//# sourceMappingURL=jr.js.map