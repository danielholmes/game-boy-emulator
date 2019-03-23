"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCallFNn = exports.createCallNn = void 0;

var _instructions = require("./instructions");

var createCallNn = function createCallNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "CALL nn").loadProgramCounter().pushWordToStack().internalDelay().loadWordOperand().storeInRegister("pc");
};

exports.createCallNn = createCallNn;

var createCallFNn = function createCallFNn(opCode, flag) {
  return new _instructions.InstructionDefinition(opCode, "CALL ".concat(flag, ",nn")).loadWordOperand().setToPcIfFlag(flag);
}; // TODO: Only load word IF needed, thus changes cycles depending on call
// TODO: See tests mentioned here: https://github.com/Gekkio/mooneye-gb/blob/master/docs/accuracy.markdown#what-is-the-exact-timing-of-calljpjr-not-jp-hl
// TODO: Ordering is wrong
// M = 0: instruction decoding
// M = 1: nn read: memory access for low byte
// M = 2: nn read: memory access for high byte
// ; cc matches or unconditional
// M = 3: internal delay
// M = 4: PC push: memory access for high byte
// M = 5: PC push: memory access for low byte


exports.createCallFNn = createCallFNn;
//# sourceMappingURL=call.js.map