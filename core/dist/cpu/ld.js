"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ldiMHlA = exports.createLddMHlA = exports.ldMNnSp = exports.ldMNnA = exports.ldMRA = exports.ldAMNn = exports.ldGrM = exports.ldAMFfN = exports.ldMFfNA = exports.createLdAMFfC = exports.ldMFfCA = exports.ldHlMN = exports.ldHlMR = exports.ldRHlM = exports.createLdRMRr = exports.ldRN = exports.ldRrNn = exports.createLdRR = void 0;

var _instructions = require("./instructions");

var createLdRR = function createLdRR(opCode, register1, register2) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register1, ",").concat(register2)).loadRegister(register2).storeInRegister(register1);
};

exports.createLdRR = createLdRR;

var ldRrNn = function ldRrNn(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",nn")).loadWordOperand().storeInRegister(register);
};

exports.ldRrNn = ldRrNn;

var ldRN = function ldRN(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",n")).loadByteOperand().storeInRegister(register);
};

exports.ldRN = ldRN;

var createLdRMRr = function createLdRMRr(opCode, register1, register2) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register1, ",(").concat(register2, ")")).loadRegister(register2).readMemory().storeInRegister(register1);
};

exports.createLdRMRr = createLdRMRr;

var ldRHlM = function ldRHlM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",(hl)")).loadRegister("hl").readMemory().storeInRegister(register);
};

exports.ldRHlM = ldRHlM;

var ldHlMR = function ldHlMR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),".concat(register)).loadRegister(register).writeMemoryFromWordRegisterAddress("hl");
};

exports.ldHlMR = ldHlMR;

var ldHlMN = function ldHlMN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),n").loadByteOperand().writeMemoryFromWordRegisterAddress("hl");
};

exports.ldHlMN = ldHlMN;

var ldMFfCA = function ldMFfCA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+c),a").loadRegister("a").writeMemoryFromFf00PlusRegisterAddress("c");
};

exports.ldMFfCA = ldMFfCA;

var createLdAMFfC = function createLdAMFfC(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(0xff00+c)").loadRegister("c").addToValue(0xff00).readMemory().storeInRegister("a");
};

exports.createLdAMFfC = createLdAMFfC;

var ldMFfNA = function ldMFfNA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+n),a").loadRegister("a").writeMemoryFromOperandAddress();
};

exports.ldMFfNA = ldMFfNA;

var ldAMFfN = function ldAMFfN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(0xff00+n)").loadByteOperand().addToValue(0xff00).readMemory().storeInRegister("a");
};

exports.ldAMFfN = ldAMFfN;

var ldGrM = function ldGrM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD a,".concat(register)).loadRegister(register).readMemory().storeInRegister("a");
};

exports.ldGrM = ldGrM;

var ldAMNn = function ldAMNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(nn)").loadWordOperand().readMemory().storeInRegister("a");
};

exports.ldAMNn = ldAMNn;

var ldMRA = function ldMRA(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (r),a").loadRegister("a").writeMemoryFromWordRegisterAddress(register);
};

exports.ldMRA = ldMRA;

var ldMNnA = function ldMNnA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),a").loadRegister("a").writeByteFromWordOperandAddress();
};

exports.ldMNnA = ldMNnA;

var ldMNnSp = function ldMNnSp(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),sp").loadRegister("sp").writeWordFromProgramWord();
};

exports.ldMNnSp = ldMNnSp;

var createLddMHlA = function createLddMHlA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LDD (hl),a").loadRegister("a").writeMemoryFromWordRegisterAddress("hl").decrementRegister("hl");
};

exports.createLddMHlA = createLddMHlA;

var ldiMHlA = function ldiMHlA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LDI (hl),a").loadRegister("a").writeMemoryFromWordRegisterAddress("hl").incrementRegister("hl");
};

exports.ldiMHlA = ldiMHlA;
//# sourceMappingURL=ld.js.map