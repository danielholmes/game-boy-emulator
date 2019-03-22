"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubN = exports.createSubMHl = exports.createSubR = void 0;

var _instructions = require("./instructions");

var createSubR = function createSubR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "SUB ".concat(register)).loadRegister(register).compareToRegister('a').storeInRegister('a');
};

exports.createSubR = createSubR;

var createSubMHl = function createSubMHl(opCode) {
  return new _instructions.InstructionDefinition(opCode, "SUB (hl)").loadRegister('hl').readMemory().compareToRegister('a').storeInRegister('a');
};

exports.createSubMHl = createSubMHl;

var createSubN = function createSubN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "SUB n").loadByteOperand().compareToRegister('a').storeInRegister('a');
};

exports.createSubN = createSubN;
//# sourceMappingURL=sub.js.map