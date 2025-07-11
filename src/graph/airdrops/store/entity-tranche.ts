import { BigInt } from "@graphprotocol/graph-ts";
import { ZERO } from "../../common/constants";
import * as Entity from "../bindings/schema";
import { TrancheWithPercentage } from "../helpers/types";

export function createTranchesWithPercentages(
  campaign: Entity.Campaign,
  tranches: TrancheWithPercentage[],
): Entity.Campaign {
  // The start time of the stream is the first tranche's start time, so we use zero for the initial duration.
  let previous = new TrancheWithPercentage(ZERO, ZERO);

  for (let i = 0; i < tranches.length; i++) {
    const current = tranches[i];

    const id = `${campaign.id}-${i.toString()}`;
    const tranche = new Entity.Tranche(id);
    tranche.campaign = campaign.id;
    tranche.duration = current.duration;
    tranche.endDuration = previous.duration.plus(current.duration);
    tranche.endPercentage = previous.unlockPercentage.plus(current.unlockPercentage);
    tranche.percentage = current.unlockPercentage;
    tranche.position = BigInt.fromU32(i);
    tranche.startDuration = previous.duration;
    tranche.startPercentage = previous.unlockPercentage;
    tranche.save();

    previous = tranches[i];
  }

  return campaign;
}
