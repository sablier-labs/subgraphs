import type { Address } from "@envio/common/bindings";

export namespace Params {
  export type CreateCommon = {
    asset: Address;
    cancelable: boolean;
    category: string;
    depositAmount: bigint;
    endTime: bigint;
    funder: Address;
    recipient: Address;
    sender: Address;
    startTime: bigint;
    tokenId: bigint;
    transferable: boolean;
  };

  export type CreateLinear = CreateCommon & {
    cliffTime: bigint;
    unlockAmountCliff: bigint | null; // v2.0 and above
    unlockAmountStart: bigint | null; // v2.0 and above
  };

  export type CreateDynamic = CreateCommon & {
    segments: Segment[];
  };

  export type CreateTranche = CreateCommon & {
    tranches: Tranche[];
  };
}

export type Segment = {
  amount: bigint;
  exponent: bigint;
  milestone: bigint;
};

export type Tranche = {
  amount: bigint;
  timestamp: bigint;
};
