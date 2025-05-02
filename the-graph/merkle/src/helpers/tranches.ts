import { BigInt as GraphBigInt } from "@graphprotocol/graph-ts";
import { zero } from "../constants";
import { type Campaign, Tranche } from "../generated/types/schema";
import type { CreateMerkleLTTranchesWithPercentagesStruct } from "../generated/types/templates/ContractMerkleFactory/SablierMerkleFactory";

export class TrancheInput {
  percentage: GraphBigInt;
  duration: GraphBigInt;

  constructor(percentage: GraphBigInt, duration: GraphBigInt) {
    this.percentage = percentage;
    this.duration = duration;
  }
}

export function createTranche(id: string, last: TrancheInput, current: TrancheInput): Tranche {
  const tranche = new Tranche(id);
  tranche.percentage = current.percentage;
  tranche.duration = current.duration;

  tranche.startDuration = last.duration;
  tranche.endDuration = last.duration.plus(current.duration);

  tranche.startPercentage = last.percentage;
  tranche.endPercentage = last.percentage.plus(current.percentage);

  return tranche;
}

export function createTranches(
  campaign: Campaign,
  tranches: Array<CreateMerkleLTTranchesWithPercentagesStruct>,
): Campaign {
  let last = new TrancheInput(zero, zero);

  for (let i = 0; i < tranches.length; i++) {
    const id = campaign.id.concat("-").concat(i.toString());
    const current = new TrancheInput(tranches[i].unlockPercentage, tranches[i].duration);
    const tranche: Tranche = createTranche(id, last, current);

    tranche.campaign = campaign.id;
    tranche.position = GraphBigInt.fromI32(i);
    tranche.save();

    last = current;
  }

  return campaign;
}
