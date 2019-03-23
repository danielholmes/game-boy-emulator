"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCpN = exports.createCpMHl = exports.createCpR = void 0;

var _instructions = require("./instructions");

var createCpR = function createCpR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "CP ".concat(register)).loadRegister(register).compareToRegister("a");
};

exports.createCpR = createCpR;

var createCpMHl = function createCpMHl(opCode) {
  return new _instructions.InstructionDefinition(opCode, "CP (hl)").loadRegister("hl").readMemory().compareToRegister("a");
};

exports.createCpMHl = createCpMHl;

var createCpN = function createCpN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "CP n").loadByteOperand().compareToRegister("a");
};

exports.createCpN = createCpN;
//# sourceMappingURL=cp.js.map