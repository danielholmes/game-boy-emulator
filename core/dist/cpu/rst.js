"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRst = exports.RST_ADDRESSES = void 0;

var _instructions = require("./instructions");

var RST_ADDRESSES = [0x0000, 0x0008, 0x0010, 0x0018, 0x0020, 0x0028, 0x0030, 0x0038];
exports.RST_ADDRESSES = RST_ADDRESSES;

var createRst = function createRst(opCode, address) {
  return new _instructions.InstructionDefinition(opCode, "RST $".concat(address.toString(16))).internalDelay().loadProgramCounter().decrementRegister("sp").decrementRegister("sp").writeMemoryWordFromStackPointer().setRegister("pc", address);
};

exports.createRst = createRst;
//# sourceMappingURL=rst.js.map