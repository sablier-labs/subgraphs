import { Address, BigInt as BInt } from "@graphprotocol/graph-ts";

export class CreateCommonParams {
  asset: Address;
  cancelable: boolean;
  category: string;
  depositAmount: BInt;
  endTime: BInt;
  funder: Address;
  recipient: Address;
  sender: Address;
  startTime: BInt;
  tokenId: BInt;
  transferable: boolean;
}

export class CreateLinearParams {
  cliffTime: BInt;
  unlockAmountCliff: BInt | null; // v2.0 and above
  unlockAmountStart: BInt | null; // v2.0 and above
}

export class CreateDynamicParams {
  segments: Array<Segment>;
}

export class CreateTranchedParams {
  tranches: Array<Tranche>;
}

export class Segment {
  amount: BInt;
  exponent: BInt;
  milestone: BInt;

  constructor(amount: BInt, exponent: BInt, milestone: BInt) {
    this.amount = amount;
    this.exponent = exponent;
    this.milestone = milestone;
  }
}

export class Tranche {
  amount: BInt;
  timestamp: BInt;

  constructor(amount: BInt, timestamp: BInt) {
    this.amount = amount;
    this.timestamp = timestamp;
  }
}
