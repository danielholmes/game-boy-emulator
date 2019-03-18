"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCallNn = void 0;

var _instructions = require("./instructions");

var createCallNn = function createCallNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, 'CALL nn').decrementStackPointer(0x0002).loadProgramCounter().writeMemoryWordFromStackPointer().loadWordOperand().storeInRegister('pc');
}; // call to nn, SP=SP-2, (SP)=PC, PC=nn


exports.createCallNn = createCallNn;
//# sourceMappingURL=call.js.map