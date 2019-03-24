"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDecRr = exports.createDecR = void 0;

var _instructions = require("./instructions");

var createDecR = function createDecR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "DEC ".concat(register)).decrementByteRegisterWithFlags(register);
};

exports.createDecR = createDecR;

var createDecRr = function createDecRr(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "DEC ".concat(register)).decrementRegister(register).internalDelay();
};

exports.createDecRr = createDecRr;
//# sourceMappingURL=dec.js.map