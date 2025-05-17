import { logError } from "../../../../common/logger";
import { EventClawback } from "../../../bindings";
import { createEntityAction, getEntityCampaign } from "../../../entities";

export function handleClawback(event: EventClawback): void {
  const campaign = getEntityCampaign(event.address);
  if (campaign === null) {
    return;
  }

  const action = createEntityAction(event, campaign, "Clawback");
  if (action === null) {
    logError("Could not handle clawback: {}", [event.transaction.hash.toString()]);
    return;
  }

  campaign.clawbackAction = action.id;
  campaign.clawbackTime = event.block.timestamp;
  campaign.save();

  action.clawbackAmount = event.params.amount;
  action.clawbackFrom = event.params.admin;
  action.clawbackTo = event.params.to;
  action.save();
}
