import { type Entity } from "@envio-airdrops/bindings";
import type { Envio } from "@envio-common/bindings";
import type * as enums from "@src/schema/enums";
export namespace Params {
  export type Action = {
    category: enums.Airdrops.ActionCategory;
    claimAmount?: bigint;
    claimIndex?: bigint;
    claimRecipient?: Envio.Address;
    claimStreamId?: string;
    claimTokenId?: bigint;
    clawbackAmount?: bigint;
    clawbackFrom?: Envio.Address;
    clawbackTo?: Envio.Address;
    fee?: bigint;
  };

  export type CampaignBase = {
    admin: Envio.Address;
    aggregateAmount: bigint;
    asset: Envio.Address;
    campaignAddress: Envio.Address;
    category: enums.Airdrops.CampaignCategory;
    expiration: bigint;
    merkleRoot: string;
    minimumFee: bigint | undefined;
    ipfsCID: string;
    name: string | undefined;
    recipientCount: bigint;
  };

  type CampaignLockup = CampaignBase & {
    cancelable: boolean;
    lockup: Envio.Address;
    shape: string | undefined;
    startTime: bigint | undefined;
    transferable: boolean;
    totalDuration: bigint;
  };

  export type CampaignLL = CampaignLockup & {
    cliffDuration: bigint;
    cliffPercentage: bigint | undefined;
    startPercentage: bigint | undefined;
  };

  export type CampaignLT = CampaignLockup & {
    tranchesWithPercentages: TrancheWithPercentage[];
  };
}

export type ActionEntities = {
  campaign: Entity.Campaign;
  watcher: Entity.Watcher;
};

export type CreateEntities = {
  asset: Entity.Asset;
  factory: Entity.Factory;
  watcher: Entity.Watcher;
};

export type TrancheWithPercentage = {
  unlockPercentage: bigint;
  duration: bigint;
};
