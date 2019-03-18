"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNop = void 0;

var _instructions = require("./instructions");

var createNop = function createNop(opCode) {
  return new _instructions.InstructionDefinition(opCode, "NOP").nop();
};

exports.createNop = createNop;
//# sourceMappingURL=special.js.map