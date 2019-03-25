"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subN = exports.subMHl = exports.subR = void 0;

var _instructions = require("./instructions");

var subR = function subR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "SUB ".concat(register)).loadRegister(register).compareToRegister("a").storeInRegister("a");
};

exports.subR = subR;

var subMHl = function subMHl(opCode) {
  return new _instructions.InstructionDefinition(opCode, "SUB (hl)").loadRegister("hl").readMemory().compareToRegister("a").storeInRegister("a");
};

exports.subMHl = subMHl;

var subN = function subN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "SUB n").loadByteOperand().compareToRegister("a").storeInRegister("a");
};

exports.subN = subN;
//# sourceMappingURL=sub.js.map