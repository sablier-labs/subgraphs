import { type enums } from "../../../schema";
import type { Envio } from "../../common/bindings";
import { type Entity } from "../bindings";

export namespace Params {
  export type ActionEntities = {
    campaign: Entity.Campaign;
    watcher: Entity.Watcher;
  };

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

  export type CreateEntities = {
    asset: Entity.Asset;
    factory: Entity.Factory;
    watcher: Entity.Watcher;
  };

  export type CreateCampaignBase = {
    admin: Envio.Address;
    asset: Envio.Address;
    aggregateAmount: bigint;
    campaignAddress: Envio.Address;
    category: enums.Airdrops.CampaignCategory;
    expiration: bigint;
    merkleRoot: string;
    minimumFee: bigint | undefined;
    ipfsCID: string;
    name: string | undefined;
    recipientCount: bigint;
  };

  type CreateCampaignLockup = CreateCampaignBase & {
    cancelable: boolean;
    lockup: Envio.Address;
    shape: string | undefined;
    startTime: bigint | undefined;
    transferable: boolean;
    totalDuration: bigint;
  };

  export type CreateCampaignLL = CreateCampaignLockup & {
    cliffDuration: bigint;
    cliffPercentage: bigint | undefined;
    startPercentage: bigint | undefined;
  };

  export type CreateCampaignLT = CreateCampaignLockup & {
    tranchesWithPercentages: TrancheWithPercentage[];
  };
}

export type TrancheWithPercentage = {
  unlockPercentage: bigint;
  duration: bigint;
};
