"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPopRr = void 0;

var _instructions = require("./instructions");

var createPopRr = function createPopRr(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "POP ".concat(register)).loadRegister('sp').readMemoryWord().storeInRegister(register).incrementRegister('sp').incrementRegister('sp');
};

exports.createPopRr = createPopRr;
//# sourceMappingURL=pop.js.map