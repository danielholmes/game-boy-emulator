"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIncSp = exports.createIncR = exports.createIncRr = void 0;

var _instructions = require("./instructions");

var createIncRr = function createIncRr(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "INC ".concat(register)).incrementGroupedRegister(register);
};

exports.createIncRr = createIncRr;

var createIncR = function createIncR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "INC ".concat(register)).incrementRegister(register);
};

exports.createIncR = createIncR;

var createIncSp = function createIncSp(opCode) {
  return new _instructions.InstructionDefinition(opCode, "INC sp").incrementStackPointer();
};

exports.createIncSp = createIncSp;
//# sourceMappingURL=inc.js.map