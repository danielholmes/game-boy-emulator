"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRet = void 0;

var _instructions = require("./instructions");

var createRet = function createRet(opCode) {
  return new _instructions.InstructionDefinition(opCode, 'RET').loadRegister('sp').readMemoryWord().storeInRegister('pc').incrementRegister('sp').incrementRegister('sp').internalDelay();
};

exports.createRet = createRet;
//# sourceMappingURL=ret.js.map