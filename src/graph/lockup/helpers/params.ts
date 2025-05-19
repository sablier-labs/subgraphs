import { Address, BigInt } from "@graphprotocol/graph-ts";

export class CreateCommonParams {
  asset: Address;
  cancelable: boolean;
  category: string;
  depositAmount: BigInt;
  endTime: BigInt;
  funder: Address;
  recipient: Address;
  sender: Address;
  startTime: BigInt;
  tokenId: BigInt;
  transferable: boolean;
}

export class CreateLinearParams {
  cliffTime: BigInt;
  unlockAmountCliff: BigInt | null; // v2.0 and above
  unlockAmountStart: BigInt | null; // v2.0 and above
}

export class CreateDynamicParams {
  segments: Segment[];
}

export class CreateTranchedParams {
  tranches: Tranche[];
}

export class Segment {
  amount: BigInt;
  exponent: BigInt;
  milestone: BigInt;

  constructor(amount: BigInt, exponent: BigInt, milestone: BigInt) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

export class Tranche {
  amount: BigInt;
  timestamp: BigInt;

  constructor(amount: BigInt, timestamp: BigInt) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}
