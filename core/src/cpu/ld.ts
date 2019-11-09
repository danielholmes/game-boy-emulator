import { ByteRegister, NonAfGroupedWordRegister } from "./registers";
import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export function createLdRR(
  opCode: OpCode,
  register1: ByteRegister,
  register2: ByteRegister
): Instruction {
  return new InstructionDefinition(opCode, `LD ${register1},${register2}`)
    .loadRegister(register2)
    .storeInRegister(register1);
}

export function ldRrNn(
  opCode: OpCode,
  register: NonAfGroupedWordRegister | "sp"
): Instruction {
  return new InstructionDefinition(opCode, `LD ${register},nn`)
    .loadWordOperand()
    .storeInRegister(register);
}

export function ldRN(opCode: OpCode, register: ByteRegister): Instruction {
  return new InstructionDefinition(opCode, `LD ${register},n`)
    .loadByteOperand()
    .storeInRegister(register);
}

export function createLdRMRr(
  opCode: OpCode,
  register1: ByteRegister,
  register2: NonAfGroupedWordRegister
): Instruction {
  return new InstructionDefinition(opCode, `LD ${register1},(${register2})`)
    .loadRegister(register2)
    .readMemory()
    .storeInRegister(register1);
}

export function ldRHlM(opCode: OpCode, register: ByteRegister): Instruction {
  return new InstructionDefinition(opCode, `LD ${register},(hl)`)
    .loadRegister("hl")
    .readMemory()
    .storeInRegister(register);
}

export function ldHlMR(opCode: OpCode, register: ByteRegister): Instruction {
  return new InstructionDefinition(opCode, `LD (hl),${register}`)
    .loadRegister(register)
    .writeMemoryFromWordRegisterAddress("hl");
}

export function ldHlMN(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD (hl),n`)
    .loadByteOperand()
    .writeMemoryFromWordRegisterAddress("hl");
}

export function ldMFfCA(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD (0xff00+c),a`)
    .loadRegister("a")
    .writeMemoryFromFf00PlusRegisterAddress("c");
}

export function createLdAMFfC(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD a,(0xff00+c)`)
    .loadRegister("c")
    .addToValue(0xff00)
    .readMemory()
    .storeInRegister("a");
}

export function ldMFfNA(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD (0xff00+n),a`)
    .loadRegister("a")
    .writeMemoryFromOperandAddress();
}

export function ldAMFfN(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD a,(0xff00+n)`)
    .loadByteOperand()
    .addToValue(0xff00)
    .readMemory()
    .storeInRegister("a");
}

export function ldGrM(
  opCode: OpCode,
  register: NonAfGroupedWordRegister
): Instruction {
  return new InstructionDefinition(opCode, `LD a,${register}`)
    .loadRegister(register)
    .readMemory()
    .storeInRegister("a");
}

export function ldAMNn(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD a,(nn)`)
    .loadWordOperand()
    .readMemory()
    .storeInRegister("a");
}

export function ldMRA(
  opCode: OpCode,
  register: NonAfGroupedWordRegister
): Instruction {
  return new InstructionDefinition(opCode, `LD (r),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress(register);
}

export function ldMNnA(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD (nn),a`)
    .loadRegister("a")
    .writeByteFromWordOperandAddress();
}

export function ldMNnSp(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LD (nn),sp`)
    .loadRegister("sp")
    .writeWordFromProgramWord();
}

export function createLddMHlA(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LDD (hl),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress("hl")
    .decrementRegister("hl");
}

export function ldiMHlA(opCode: OpCode): Instruction {
  return new InstructionDefinition(opCode, `LDI (hl),a`)
    .loadRegister("a")
    .writeMemoryFromWordRegisterAddress("hl")
    .incrementRegister("hl");
}
