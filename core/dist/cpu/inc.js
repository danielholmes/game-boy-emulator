"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIncR = exports.createIncRr = void 0;

var _instructions = require("./instructions");

var createIncRr = function createIncRr(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "INC ".concat(register)).incrementWordRegisterWithFlags(register).internalDelay();
};

exports.createIncRr = createIncRr;

var createIncR = function createIncR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "INC ".concat(register)).incrementByteRegisterWithFlags(register);
};

exports.createIncR = createIncR;
//# sourceMappingURL=inc.js.map