import { Instruction, InstructionDefinition, OpCode } from './instructions'

/*
rsv: function() {
      Z80._rsv.a = Z80._r.a;
      Z80._rsv.b = Z80._r.b;
      Z80._rsv.c = Z80._r.c;
      Z80._rsv.d = Z80._r.d;
      Z80._rsv.e = Z80._r.e;
      Z80._rsv.f = Z80._r.f;
      Z80._rsv.h = Z80._r.h;
      Z80._rsv.l = Z80._r.l;
    }
 */

export type RstAddress = 0x0000 | 0x0008 | 0x0010 | 0x0018 | 0x0020 | 0x0028 | 0x0030 | 0x0038
export const RST_ADDRESSES: ReadonlyArray<RstAddress> = [0x0000, 0x0008, 0x0010, 0x0018, 0x0020, 0x0028, 0x0030, 0x0038]

export const createRst = (opCode: OpCode, address: RstAddress): Instruction =>
  new InstructionDefinition(opCode, `RST $${address.toString(16)}`)
    .decrementStackPointer(2)
    .loadProgramCounter()
    .writeMemoryFromStackPointer()
    .setProgramCounter(address)

// Z80._r.pc=0x08;

// self.PC += 1
// self.mb[self.SP-1] = self.PC >> 8 # High
// self.mb[self.SP-2] = self.PC & 0xFF # Low
// self.SP -= 2
// self.PC = 0