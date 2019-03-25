"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ret = void 0;

var _instructions = require("./instructions");

var ret = function ret(opCode) {
  return new _instructions.InstructionDefinition(opCode, "RET").loadRegister("sp").readMemoryWord().storeInRegister("pc").incrementRegister("sp").incrementRegister("sp").internalDelay();
};

exports.ret = ret;
//# sourceMappingURL=ret.js.map