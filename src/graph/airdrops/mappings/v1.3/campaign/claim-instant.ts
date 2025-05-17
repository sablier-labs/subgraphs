import { ONE } from "../../../../common/constants";
import { logError } from "../../../../common/logger";
import { Claim as EventClaimInstant } from "../../../bindings/templates/SablierMerkleInstant_v1_3/SablierMerkleInstant";
import { createEntityAction, createOrUpdateActivity, getEntityCampaign } from "../../../entities";

export function handleClaimInstant(event: EventClaimInstant): void {
  const campaign = getEntityCampaign(event.address);
  if (campaign === null) {
    return;
  }

  const action = createEntityAction(event, campaign, "Claim");
  if (action === null) {
    logError("Could not handle the Instant claim airdrop: {}", [event.transaction.hash.toString()]);
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.claimedCount = campaign.claimedCount.plus(ONE);
  campaign.save();

  /* --------------------------------- ACTION --------------------------------- */
  action.claimIndex = event.params.index;
  action.claimAmount = event.params.amount;
  action.claimRecipient = event.params.recipient;
  action.fee = event.transaction.value;
  action.save();

  /* -------------------------------- ACTIVITY -------------------------------- */
  createOrUpdateActivity(event, campaign, event.params.amount);
}
