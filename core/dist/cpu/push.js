"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.push = void 0;

var _instructions = require("./instructions");

var push = function push(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "PUSH ".concat(register)).internalDelay().loadRegister(register).pushWordToStack();
};

exports.push = push;
//# sourceMappingURL=push.js.map