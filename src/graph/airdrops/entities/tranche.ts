import { BigInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import { EntityCampaign, EntityTranche } from "../bindings";
import { TrancheWithPercentage } from "../params";

export function addTranchesWithPercentages(
  campaign: EntityCampaign,
  tranches: TrancheWithPercentage[],
): EntityCampaign {
  // The start time of the stream is the first tranche's start time, so we use zero for the initial duration.
  let previous = new TrancheWithPercentage(ZERO, ZERO);

  for (let i = 0; i < tranches.length; i++) {
    const current = tranches[i];

    const id = campaign.id + "-" + i.toString();
    const tranche = new EntityTranche(id);

    tranche.percentage = current.unlockPercentage;
    tranche.duration = current.duration;

    tranche.startDuration = previous.duration;
    tranche.startPercentage = previous.unlockPercentage;

    tranche.endDuration = previous.duration.plus(current.duration);
    tranche.endPercentage = previous.unlockPercentage.plus(current.unlockPercentage);

    tranche.campaign = campaign.id;
    tranche.position = BigInt.fromU32(i);
    tranche.save();

    previous = tranches[i];
  }

  return campaign;
}
