import { ByteRegister } from './registers'
import { GroupedWordRegister } from './groupedRegisters'
import { Instruction, InstructionDefinition, OpCode } from './instructions'

export const createLdRR = (opCode: OpCode, register1: ByteRegister, register2: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register1},${register2}`)
    .loadRegister(register2)
    .storeInRegister(register1)

export const createLdRN = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},n`)
    .loadProgramByte()
    .storeInRegister(register)

export const createLdRHlM = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD ${register},(hl)`)
    .loadGroupedRegister('hl')
    .readMemory()
    .storeInRegister(register)

export const createLdHlMR = (opCode: OpCode, register: ByteRegister): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),${register}`)
    .loadRegister(register)
    .writeMemoryFromGroupedRegisterAddress('hl')

export const createLdHlMN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (hl),n`)
    .loadProgramByte()
    .writeMemoryFromGroupedRegisterAddress('hl')

export const createLdGrM = (opCode: OpCode, register: GroupedWordRegister): Instruction =>
  new InstructionDefinition(opCode, `LD a,${register}`)
    .loadGroupedRegister(register)
    .readMemory()
    .storeInRegister('a')

export const createLdAMNn = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD a,(nn)`)
    .loadProgramWord()
    .readMemory()
    .storeInRegister('a')

export const createLdMRA = (opCode: OpCode, register: GroupedWordRegister): Instruction =>
  new InstructionDefinition(opCode, `LD (r),a`)
    .loadRegister('a')
    .writeMemoryFromGroupedRegisterAddress(register)

export const createLdMNnA = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, `LD (nn),a`)
    .loadRegister('a')
    .writeMemoryFromProgramWord()
