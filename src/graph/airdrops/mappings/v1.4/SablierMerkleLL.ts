import { Claim, Claim1, Clawback, TransferAdmin } from "../../bindings/templates/SablierMerkleLL_v1_4/SablierMerkleLL";
import { Params } from "../../helpers";
import { Store } from "../../store";
import { handleClaimLockup, handleClawback, handleTransferAdmin } from "../common";

export function handle_SablierMerkleLL_v1_4_TransferAdmin(event: TransferAdmin): void {
  handleTransferAdmin(event, {
    newAdmin: event.params.newAdmin,
    oldAdmin: event.params.oldAdmin,
  });
}

// handles the Claim event when a stream is not created anymore
export function handle_SablierMerkleLL_v1_4_Claim(event: Claim): void {
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
    claimTo: event.params.to,
    fee: event.transaction.value,
  } as Params.Action);
}

export function handle_SablierMerkleLL_v1_4_Claim1(event: Claim1): void {
  handleClaimLockup(event, {
    amount: event.params.amount,
    index: event.params.index,
    recipient: event.params.recipient,
    claimTo: event.params.to,
    streamId: event.params.streamId,
  });
}

export function handle_SablierMerkleLL_v1_4_Clawback(event: Clawback): void {
  handleClawback(event, {
    admin: event.params.admin,
    amount: event.params.amount,
    to: event.params.to,
  });
}