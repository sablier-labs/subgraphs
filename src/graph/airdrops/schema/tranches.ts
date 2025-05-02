import { BigInt as BInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../shared/constants";
import { EntityCampaign, EntityTranche } from "../bindings";
import { CreateMerkleLTTranchesWithPercentagesStruct } from "../bindings/types/templates/ContractMerkleFactory/SablierMerkleFactory";

export class TrancheInput {
  percentage: BInt;
  duration: BInt;
  constructor(percentage: BInt, duration: BInt) {
    this.percentage = percentage;
    this.duration = duration;
  }
}

export function createTranche(id: string, last: TrancheInput, current: TrancheInput): EntityTranche {
  const tranche = new EntityTranche(id);
  tranche.percentage = current.percentage;
  tranche.duration = current.duration;

  tranche.startDuration = last.duration;
  tranche.endDuration = last.duration.plus(current.duration);

  tranche.startPercentage = last.percentage;
  tranche.endPercentage = last.percentage.plus(current.percentage);

  return tranche;
}

export function createTranches(
  campaign: EntityCampaign,
  tranches: Array<CreateMerkleLTTranchesWithPercentagesStruct>,
): EntityCampaign {
  let last = new TrancheInput(ZERO, ZERO);

  for (let i = 0; i < tranches.length; i++) {
    const id = `${campaign.id}-${i}`;
    const current = new TrancheInput(tranches[i].unlockPercentage, tranches[i].duration);
    const tranche = createTranche(id, last, current);

    tranche.campaign = campaign.id;
    tranche.position = BInt.fromI32(i);
    tranche.save();

    last = current;
  }

  return campaign;
}
