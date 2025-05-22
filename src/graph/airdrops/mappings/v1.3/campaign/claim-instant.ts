import { Claim as EventClaimInstant } from "../../../bindings/templates/SablierMerkleInstant_v1_3/SablierMerkleInstant";
import { Params } from "../../../helpers";
import { Store } from "../../../store";

export function handleClaimInstant(event: EventClaimInstant): void {
  const campaign = Store.Campaign.get(event.address);
  if (campaign === null) {
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  const claimAmount = event.params.amount;
  Store.Campaign.updateClaimed(campaign, claimAmount);

  /* -------------------------------- ACTIVITY -------------------------------- */
  Store.Activity.createOrUpdate(event, campaign, claimAmount);

  /* --------------------------------- ACTION --------------------------------- */
  Store.Action.create(event, campaign, {
    category: "Claim",
    claimAmount: claimAmount,
    claimIndex: event.params.index,
    claimRecipient: event.params.recipient,
    fee: event.transaction.value,
  } as Params.Action);
}
