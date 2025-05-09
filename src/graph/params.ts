import { Address, BigInt as BInt } from "@graphprotocol/graph-ts";

export class ActionParams {
  addressA: Address | null = null;
  addressB: Address | null = null;
  amountA: BInt | null = null;
  amountB: BInt | null = null;
  streamId: string | null = null;
}
