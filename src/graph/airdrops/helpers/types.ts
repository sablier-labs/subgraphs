import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export namespace Params {
  export class Action {
    category: string;
    claimAmount: BigInt | null;
    claimIndex: BigInt | null;
    claimRecipient: Address | null;
    claimStreamId: string | null;
    claimTokenId: BigInt | null;
    clawbackAmount: BigInt | null;
    clawbackFrom: Address | null;
    clawbackTo: Address | null;
    fee: BigInt | null;
  }

  export class CampaignBase {
    admin: Address;
    aggregateAmount: BigInt;
    asset: Address;
    campaignAddress: Address;
    category: string;
    expiration: BigInt;
    minimumFee: BigInt | null;
    ipfsCID: string;
    merkleRoot: Bytes;
    name: string | null;
    recipientCount: BigInt;
  }

  export class CampaignLL {
    // Lockup
    cancelable: boolean;
    lockup: Address;
    shape: string | null;
    startTime: BigInt | null;
    transferable: boolean;
    totalDuration: BigInt;

    // LockupLinear
    cliffDuration: BigInt;
    cliffPercentage: BigInt | null;
    startPercentage: BigInt | null;
  }

  export class CampaignLT {
    // Lockup
    cancelable: boolean;
    lockup: Address;
    shape: string | null;
    startTime: BigInt | null;
    transferable: boolean;
    totalDuration: BigInt;

    // LockupTranched
    tranchesWithPercentages: TrancheWithPercentage[];
  }
}

export class TrancheWithPercentage {
  unlockPercentage: BigInt;
  duration: BigInt;

  constructor(unlockPercentage: BigInt, duration: BigInt) {
    this.unlockPercentage = unlockPercentage;
    this.duration = duration;
  }
}
