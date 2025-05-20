import { Address } from "@graphprotocol/graph-ts";
import { ONE } from "../../../../common/constants";
import { Id } from "../../../../common/id";
import { logError } from "../../../../common/logger";
import { Claim as EventClaimLockup } from "../../../bindings/templates/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL";
import { Store } from "../../../store";

export function handleClaimLockup(event: EventClaimLockup): void {
  const campaign = Store.Campaign.get(event.address);
  if (campaign === null) {
    return;
  }
  const lockup = campaign.lockup;
  if (lockup === null) {
    logError("Campaign has no Lockup address: {}", [event.address.toHexString()]);
    return;
  }

  const action = Store.Action.create(event, campaign, "Claim");
  if (action === null) {
    logError("Could not handle the Lockup claim: {}", [event.transaction.hash.toString()]);
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  campaign.claimedAmount = campaign.claimedAmount.plus(event.params.amount);
  campaign.claimedCount = campaign.claimedCount.plus(ONE);
  campaign.save();

  /* --------------------------------- ACTION --------------------------------- */
  const tokenId = event.params.streamId;
  const streamId = Id.stream(Address.fromBytes(lockup), tokenId);

  action.claimIndex = event.params.index;
  action.claimAmount = event.params.amount;
  action.claimRecipient = event.params.recipient;
  action.claimStreamId = streamId;
  action.fee = event.transaction.value;
  action.save();

  /* -------------------------------- ACTIVITY -------------------------------- */
  Store.Activity.createOrUpdate(event, campaign, event.params.amount);
}
