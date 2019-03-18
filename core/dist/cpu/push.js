"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPush = void 0;

var _instructions = require("./instructions");

var createPush = function createPush(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "PUSH ".concat(register)).internalDelay().loadRegister(register).pushWordToStack();
};

exports.createPush = createPush;
//# sourceMappingURL=push.js.map