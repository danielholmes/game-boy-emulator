import { Instruction, InstructionDefinition, OpCode } from "./instructions";
import { Cpu, Cycles } from "./types";
import { Mmu } from "../memory/mmu";
import { fromPairs } from "lodash";
import { numberToByteHex } from "../types";
import { ByteRegister } from "./registers";

class CbInstruction implements Instruction {
  public readonly opCode: OpCode;
  public readonly label: string = "CB";

  public constructor(opCode: OpCode) {
    this.opCode = opCode;
  }

  public execute(cpu: Cpu, mmu: Mmu): Cycles {
    const operand = mmu.readByte(cpu.registers.pc);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const subInstruction = CB_INSTRUCTIONS[operand];
    if (!subInstruction) {
      throw new Error(`No instruction for opCode ${numberToByteHex(operand)}`);
    }
    cpu.registers.pc++;
    subInstruction.execute(cpu, mmu);
    return 4;
  }
}

export const createCb = (opCode: OpCode): Instruction =>
  new CbInstruction(opCode);

export const createCbBit = (
  opCode: OpCode,
  register: ByteRegister
): Instruction =>
  new InstructionDefinition(opCode, `BIT ${register}`).bitFlags(register);

const CB_INSTRUCTIONS: { [opCode: number]: Instruction } = fromPairs(
  [
    ...([[0x7b, "e"], [0x7c, "h"]] as ReadonlyArray<
      [OpCode, ByteRegister]
    >).map(([opCode, register]) => createCbBit(opCode, register))
  ].map((i: Instruction) => [i.opCode, i])
);
