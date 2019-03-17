import { ByteValue, WordValue } from './types'
import { fromPairs } from 'lodash'

export type MemoryAddress = number

export class Memory {
  private readonly raw: Array<ByteValue>

  public constructor(raw?: Array<ByteValue>)
  {
    this.raw = raw ? raw : []
  }

  public readByte(address: MemoryAddress): ByteValue {
    return this.raw[address]
  }

  public readWord(address: MemoryAddress): WordValue {
    return (this.readByte(address) << 8) + this.readByte(address + 1)
  }

  public writeByte(address: MemoryAddress, value: ByteValue): void {
    this.raw[address] = value
  }

  public writeWord(address: MemoryAddress, value: WordValue): void {
    this.writeByte(address, value >> 8)
    this.writeByte(address + 1, value & 255)
  }

  public getValues(): { [address: number]: number } {
    // console.log('getValues', typeof this.raw, Array.isArray(this.raw), this.raw.map((value, address) => [address, value]))
    return fromPairs(this.raw.map((value, address) => [address, value]))
  }

  public copy(): Memory {
    return new Memory(this.raw.slice())
  }
}

// range(0, 0xFFFF).map(constant(0x00))
