import { Address } from "@graphprotocol/graph-ts";
import { Id } from "../../../../common/id";
import { logError } from "../../../../common/logger";
import { Claim as EventClaimLockup } from "../../../bindings/templates/SablierV2MerkleStreamerLL_v1_1/SablierV2MerkleStreamerLL";
import { isVersionWithFees } from "../../../helpers";
import { Params } from "../../../helpers/types";
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

  /* -------------------------------- CAMPAIGN -------------------------------- */
  const claimAmount = event.params.amount;
  Store.Campaign.updateClaimed(campaign, claimAmount);

  /* -------------------------------- ACTIVITY -------------------------------- */
  Store.Activity.createOrUpdate(event, campaign, claimAmount);

  /* --------------------------------- ACTION --------------------------------- */
  const tokenId = event.params.streamId;
  const streamId = Id.stream(Address.fromBytes(lockup), tokenId);
  Store.Action.create(event, campaign, {
    category: "Claim",
    claimAmount: claimAmount,
    claimIndex: event.params.index,
    claimRecipient: event.params.recipient,
    claimStreamId: streamId,
    claimTokenId: tokenId,
    fee: isVersionWithFees() ? event.transaction.value : null,
  } as Params.Action);
}
