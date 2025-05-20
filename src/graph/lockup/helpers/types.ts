import { Address, BigInt } from "@graphprotocol/graph-ts";

export namespace Params {
  export class Cancel {
    recipient: Address;
    recipientAmount: BigInt;
    sender: Address;
    senderAmount: BigInt;
    streamId: BigInt;
  }

  export class CreateCommon {
    asset: Address;
    cancelable: boolean;
    category: string;
    depositAmount: BigInt;
    endTime: BigInt;
    funder: Address;
    recipient: Address;
    shape: string | null;
    sender: Address;
    startTime: BigInt;
    tokenId: BigInt;
    transferable: boolean;
  }

  export class CreateLinear {
    cliffTime: BigInt;
    unlockAmountCliff: BigInt | null; // v2.0 and above
    unlockAmountStart: BigInt | null; // v2.0 and above
  }

  export class CreateDynamic {
    segments: Segment[];
  }

  export class CreateTranched {
    tranches: Tranche[];
  }

  export class Withdraw {
    amount: BigInt;
    streamId: BigInt;
    to: Address;
  }
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
