"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJrNzN = void 0;

var _instructions = require("./instructions");

var createJrNzN = function createJrNzN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "JR cc,nn").loadSignedByteOperand().jrCheck();
};

exports.createJrNzN = createJrNzN;
//# sourceMappingURL=jr.js.map