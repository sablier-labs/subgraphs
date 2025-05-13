import { Address, BigInt } from "@graphprotocol/graph-ts";

export class ActionParams {
  addressA: Address | null = null;
  addressB: Address | null = null;
  amountA: BigInt | null = null;
  amountB: BigInt | null = null;
  category: string;
  streamId: string | null = null;
}
