"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAdcN = void 0;

var _instructions = require("./instructions");

// adc  A,n         CE nn      8 z0hc A=A+n+cy
var createAdcN = function createAdcN(opCode) {
  return new _instructions.InstructionDefinition(opCode, 'ADC a,n').loadByteOperand().addWithCarryToA();
};

exports.createAdcN = createAdcN;
//# sourceMappingURL=add.js.map