"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLddMHlA = exports.createLdMNnSp = exports.createLdSpNn = exports.createLdGrNn = exports.createLdMNnA = exports.createLdMRA = exports.createLdAMNn = exports.createLdGrM = exports.createLdMNA = exports.createLdMCA = exports.createLdHlMN = exports.createLdHlMR = exports.createLdRHlM = exports.createLdAMRr = exports.createLdRN = exports.createLdRR = void 0;

var _instructions = require("./instructions");

var createLdRR = function createLdRR(opCode, register1, register2) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register1, ",").concat(register2)).loadRegister(register2).storeInRegister(register1);
};

exports.createLdRR = createLdRR;

var createLdRN = function createLdRN(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",n")).loadByteOperand().storeInRegister(register);
};

exports.createLdRN = createLdRN;

var createLdAMRr = function createLdAMRr(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(".concat(register, ")")).loadGroupedRegister(register).readMemory().storeInRegister("a");
};

exports.createLdAMRr = createLdAMRr;

var createLdRHlM = function createLdRHlM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",(hl)")).loadGroupedRegister("hl").readMemory().storeInRegister(register);
};

exports.createLdRHlM = createLdRHlM;

var createLdHlMR = function createLdHlMR(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),".concat(register)).loadRegister(register).writeMemoryFromGroupedRegisterAddress("hl");
};

exports.createLdHlMR = createLdHlMR;

var createLdHlMN = function createLdHlMN(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (hl),n").loadByteOperand().writeMemoryFromGroupedRegisterAddress("hl");
};

exports.createLdHlMN = createLdHlMN;

var createLdMCA = function createLdMCA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+c),a").loadRegister("a").writeMemoryFromRegisterAddress("c");
};

exports.createLdMCA = createLdMCA;

var createLdMNA = function createLdMNA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (0xff00+n),a").loadRegister("a").writeMemoryFromOperandAddress();
};

exports.createLdMNA = createLdMNA;

var createLdGrM = function createLdGrM(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD a,".concat(register)).loadGroupedRegister(register).readMemory().storeInRegister("a");
};

exports.createLdGrM = createLdGrM;

var createLdAMNn = function createLdAMNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD a,(nn)").loadWordOperand().readMemory().storeInRegister("a");
};

exports.createLdAMNn = createLdAMNn;

var createLdMRA = function createLdMRA(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD (r),a").loadRegister("a").writeMemoryFromGroupedRegisterAddress(register);
};

exports.createLdMRA = createLdMRA;

var createLdMNnA = function createLdMNnA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),a").loadRegister("a").writeByteFromWordOperandAddress();
};

exports.createLdMNnA = createLdMNnA;

var createLdGrNn = function createLdGrNn(opCode, register) {
  return new _instructions.InstructionDefinition(opCode, "LD ".concat(register, ",nn")).loadWordOperand().storeInGroupedRegister(register);
};

exports.createLdGrNn = createLdGrNn;

var createLdSpNn = function createLdSpNn(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD sp,nn").loadWordOperand().storeInStackPointer();
};

exports.createLdSpNn = createLdSpNn;

var createLdMNnSp = function createLdMNnSp(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LD (nn),sp").loadStackPointer().writeWordFromProgramWord();
};

exports.createLdMNnSp = createLdMNnSp;

var createLddMHlA = function createLddMHlA(opCode) {
  return new _instructions.InstructionDefinition(opCode, "LDD (hl),a").loadRegister("a").writeMemoryFromGroupedRegisterAddress("hl").decrementGroupedRegister("hl");
};

exports.createLddMHlA = createLddMHlA;
//# sourceMappingURL=ld.js.map