"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSubMHl = exports.createSubR = void 0;

var _instructions = require("./instructions");

var createSubR = function createSubR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "SUB ".concat(register)).loadRegister(register).subtractFromRegister('a');
};

exports.createSubR = createSubR;

var createSubMHl = function createSubMHl(opCode) {
  return new _instructions.InstructionDefinition(opCode, "SUB (hl)").loadRegister('hl').readMemory().subtractFromRegister('a');
};

exports.createSubMHl = createSubMHl;
//# sourceMappingURL=sub.js.map