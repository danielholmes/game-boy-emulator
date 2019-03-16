import { ByteValue, WordValue } from './types'

export type MemoryAddress = number

export class Memory {
  private readonly raw: Array<ByteValue>

  public constructor(raw: Array<ByteValue> = [])
  {
    this.raw = raw
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.raw[address]
  }

  public readWord(address: MemoryAddress): WordValue {
    return this.readByte(address) + (this.readByte(address + 1) << 8)
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.raw[address] = value
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.writeByte(address, value & 255)
    this.writeByte(address + 1, value >> 8)
  }

  public copy(): Memory {
    return new Memory(this.raw.slice())
  }
}

// range(0, 0xFFFF).map(constant(0x00))
