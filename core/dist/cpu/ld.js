"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLdiMHlA = exports.createLddMHlA = exports.createLdMNnSp = exports.createLdMNnA = exports.createLdMRA = exports.createLdAMNn = exports.createLdGrM = exports.createLdMNA = exports.createLdMFfCA = exports.createLdHlMN = exports.createLdHlMR = exports.createLdRHlM = exports.createLdRMRr = exports.createLdRN = exports.createLdRrNn = exports.createLdRR = void 0;

var _instructions = require("./instructions");

var createLdRR = function createLdRR(opCode, register1, register2) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register1, ",").concat(register2)).loadRegister(register2).storeInRegister(register1);
};

exports.createLdRR = createLdRR;

var createLdRrNn = function createLdRrNn(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",nn")).loadWordOperand().storeInRegister(register);
};

exports.createLdRrNn = createLdRrNn;

var createLdRN = function createLdRN(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",n")).loadByteOperand().storeInRegister(register);
};

exports.createLdRN = createLdRN;

var createLdRMRr = function createLdRMRr(opCode, register1, register2) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register1, ",(").concat(register2, ")")).loadRegister(register2).readMemory().storeInRegister(register1);
};

exports.createLdRMRr = createLdRMRr;

var createLdRHlM = function createLdRHlM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",(hl)")).loadRegister("hl").readMemory().storeInRegister(register);
};

exports.createLdRHlM = createLdRHlM;

var createLdHlMR = function createLdHlMR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),".concat(register)).loadRegister(register).writeMemoryFromWordRegisterAddress("hl");
};

exports.createLdHlMR = createLdHlMR;

var createLdHlMN = function createLdHlMN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),n").loadByteOperand().writeMemoryFromWordRegisterAddress("hl");
};

exports.createLdHlMN = createLdHlMN;

var createLdMFfCA = function createLdMFfCA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+c),a").loadRegister("a").writeMemoryFromFf00PlusRegisterAddress("c");
};

exports.createLdMFfCA = createLdMFfCA;

var createLdMNA = function createLdMNA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+n),a").loadRegister("a").writeMemoryFromOperandAddress();
};

exports.createLdMNA = createLdMNA;

var createLdGrM = function createLdGrM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD a,".concat(register)).loadRegister(register).readMemory().storeInRegister("a");
};

exports.createLdGrM = createLdGrM;

var createLdAMNn = function createLdAMNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(nn)").loadWordOperand().readMemory().storeInRegister("a");
};

exports.createLdAMNn = createLdAMNn;

var createLdMRA = function createLdMRA(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (r),a").loadRegister("a").writeMemoryFromWordRegisterAddress(register);
};

exports.createLdMRA = createLdMRA;

var createLdMNnA = function createLdMNnA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),a").loadRegister("a").writeByteFromWordOperandAddress();
};

exports.createLdMNnA = createLdMNnA;

var createLdMNnSp = function createLdMNnSp(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),sp").loadRegister("sp").writeWordFromProgramWord();
};

exports.createLdMNnSp = createLdMNnSp;

var createLddMHlA = function createLddMHlA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LDD (hl),a").loadRegister("a").writeMemoryFromWordRegisterAddress("hl").decrementRegister("hl");
};

exports.createLddMHlA = createLddMHlA;

var createLdiMHlA = function createLdiMHlA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LDI (hl),a").loadRegister("a").writeMemoryFromWordRegisterAddress("hl").incrementRegister("hl");
};

exports.createLdiMHlA = createLdiMHlA;
//# sourceMappingURL=ld.js.map