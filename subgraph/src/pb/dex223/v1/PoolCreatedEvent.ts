// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Transaction } from "./Transaction";
import { Token } from "./Token";

export class PoolCreatedEvent {
  static encode(message: PoolCreatedEvent, writer: Writer): void {
    const tx = message.tx;
    if (tx !== null) {
      writer.uint32(10);
      writer.fork();
      Transaction.encode(tx, writer);
      writer.ldelim();
    }

    const token0 = message.token0;
    if (token0 !== null) {
      writer.uint32(18);
      writer.fork();
      Token.encode(token0, writer);
      writer.ldelim();
    }

    const token1 = message.token1;
    if (token1 !== null) {
      writer.uint32(26);
      writer.fork();
      Token.encode(token1, writer);
      writer.ldelim();
    }

    writer.uint32(34);
    writer.string(message.fee);

    writer.uint32(42);
    writer.string(message.poolAddress);

    writer.uint32(48);
    writer.int32(message.tickSpacing);
  }

  static decode(reader: Reader, length: i32): PoolCreatedEvent {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new PoolCreatedEvent();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tx = Transaction.decode(reader, reader.uint32());
          break;

        case 2:
          message.token0 = Token.decode(reader, reader.uint32());
          break;

        case 3:
          message.token1 = Token.decode(reader, reader.uint32());
          break;

        case 4:
          message.fee = reader.string();
          break;

        case 5:
          message.poolAddress = reader.string();
          break;

        case 6:
          message.tickSpacing = reader.int32();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  tx: Transaction | null;
  token0: Token | null;
  token1: Token | null;
  fee: string;
  poolAddress: string;
  tickSpacing: i32;

  constructor(
    tx: Transaction | null = null,
    token0: Token | null = null,
    token1: Token | null = null,
    fee: string = "",
    poolAddress: string = "",
    tickSpacing: i32 = 0
  ) {
    this.tx = tx;
    this.token0 = token0;
    this.token1 = token1;
    this.fee = fee;
    this.poolAddress = poolAddress;
    this.tickSpacing = tickSpacing;
  }
}
