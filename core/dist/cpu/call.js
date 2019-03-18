"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCallNn = void 0;

var _instructions = require("./instructions");

var createCallNn = function createCallNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "CALL nn").loadProgramCounter().pushWordToStack().internalDelay().loadWordOperand().storeInRegister("pc");
}; // TODO: Ordering is wrong
// M = 0: instruction decoding
// M = 1: nn read: memory access for low byte
// M = 2: nn read: memory access for high byte
// ; cc matches or unconditional
// M = 3: internal delay
// M = 4: PC push: memory access for high byte
// M = 5: PC push: memory access for low byte


exports.createCallNn = createCallNn;
//# sourceMappingURL=call.js.map