import type { Envio } from "@envio-common/bindings";
import type { Entity } from "@envio-lockup/bindings";
import type { Lockup as enums } from "@src/schema/enums";
export namespace Params {
  export type Cancel = {
    recipient: Envio.Address;
    recipientAmount: bigint;
    sender: Envio.Address;
    senderAmount: bigint;
    streamId: bigint;
  };

  export type CreateCommon = {
    asset: Envio.Address;
    cancelable: boolean;
    category: enums.StreamCategory;
    depositAmount: bigint;
    endTime: bigint;
    funder: Envio.Address;
    recipient: Envio.Address;
    sender: Envio.Address;
    shape?: string;
    startTime: bigint;
    tokenId: bigint;
    transferable: boolean;
  };

  export type CreateLinear = CreateCommon & {
    cliffTime: bigint;
    unlockAmountCliff?: bigint; // v2.0 and above
    unlockAmountStart?: bigint; // v2.0 and above
  };

  export type CreateDynamic = CreateCommon & {
    segments: Segment[];
  };

  export type CreateTranche = CreateCommon & {
    tranches: Tranche[];
  };

  export type Withdraw = {
    amount: bigint;
    streamId: bigint;
    to: Envio.Address;
  };
}

export type CreateEntities = {
  asset: Entity.Asset;
  batch: Entity.Batch;
  batcher: Entity.Batcher;
  watcher: Entity.Watcher;
};

export type Segment = {
  amount: bigint;
  exponent: bigint;
  milestone: bigint;
};

export type Tranche = {
  amount: bigint;
  timestamp: bigint;
};
