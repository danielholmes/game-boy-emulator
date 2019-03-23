// adc  A,n         CE nn      8 z0hc A=A+n+cy

import { Instruction, InstructionDefinition, OpCode } from "./instructions";

export const createAdcN = (opCode: OpCode): Instruction =>
  new InstructionDefinition(opCode, 'ADC a,n')
    .loadByteOperand()
    .addWithCarryToA()
