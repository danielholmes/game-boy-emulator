"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRlMHl = exports.createRlR = void 0;

var _instructions = require("./instructions");

var createRlR = function createRlR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "RL ".concat(register)).rotateLeft(register);
};

exports.createRlR = createRlR;

var createRlMHl = function createRlMHl(opCode) {
  return new _instructions.InstructionDefinition(opCode, 'RL (hl)');
};

exports.createRlMHl = createRlMHl;
//# sourceMappingURL=rl.js.map