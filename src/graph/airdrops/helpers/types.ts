import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";

export class CampaignCommonParams {
  admin: Address;
  aggregateAmount: BigInt;
  asset: Address;
  campaignAddress: Address;
  category: string;
  expiration: BigInt;
  minimumFee: BigInt | null;
  ipfsCID: string;
  name: string | null;
  recipientCount: BigInt;
  root: Bytes;
}

export class CampaignLLParams {
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

export class CampaignLTParams {
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

export class TrancheWithPercentage {
  unlockPercentage: BigInt;
  duration: BigInt;

  constructor(unlockPercentage: BigInt, duration: BigInt) {
    this.unlockPercentage = unlockPercentage;
    this.duration = duration;
  }
}
