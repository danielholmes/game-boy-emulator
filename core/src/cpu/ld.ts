import { ByteRegister, NonAfGroupedWordRegister } from "./registers";
import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createLdRR = (
  opCode: OpCode,
  register1: ByteRegister,
  register2: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD ${register1},${register2}`)
    .loadRegister(register2)
    .storeInRegister(register1);

export const createLdRrNn = (
  opCode: OpCode,
  register: NonAfGroupedWordRegister | "sp"
): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},nn`)
    .loadWordOperand()
    .storeInRegister(register);

export const createLdRN = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},n`)
    .loadByteOperand()
    .storeInRegister(register);

export const createLdRMRr = (
  opCode: OpCode,
  register1: ByteRegister,
  register2: NonAfGroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD ${register1},(${register2})`)
    .loadRegister(register2)
    .readMemory()
    .storeInRegister(register1);

export const createLdRHlM = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},(hl)`)
    .loadRegister("hl")
    .readMemory()
    .storeInRegister(register);

export const createLdHlMR = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),${register}`)
    .loadRegister(register)
    .writeMemoryFromWordRegisterAddress("hl");

export const createLdHlMN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),n`)
    .loadByteOperand()
    .writeMemoryFromWordRegisterAddress("hl");

export const createLdMFfCA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (0xff00+c),a`)
    .loadRegister("a")
    .writeMemoryFromFf00PlusRegisterAddress("c");

export const createLdMNA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (0xff00+n),a`)
    .loadRegister("a")
    .writeMemoryFromOperandAddress();

export const createLdAMFfN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD a,(0xff00+n)`)
    .loadByteOperand()
    .addToValue(0xff00)
    .readMemory()
    .storeInRegister('a');

export const createLdGrM = (
  opCode: OpCode,
  register: NonAfGroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD a,${register}`)
    .loadRegister(register)
    .readMemory()
    .storeInRegister("a");

export const createLdAMNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD a,(nn)`)
    .loadWordOperand()
    .readMemory()
    .storeInRegister("a");

export const createLdMRA = (
  opCode: OpCode,
  register: NonAfGroupedWordRegister
): Instruction =>
  new InstructionDefinition(opCode, `LD (r),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress(register);

export const createLdMNnA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (nn),a`)
    .loadRegister("a")
    .writeByteFromWordOperandAddress();

export const createLdMNnSp = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (nn),sp`)
    .loadRegister("sp")
    .writeWordFromProgramWord();

export const createLddMHlA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LDD (hl),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress("hl")
    .decrementRegister("hl");

export const createLdiMHlA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LDI (hl),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress("hl")
    .incrementRegister("hl");
