import { Claim, Clawback, TransferAdmin } from "../../bindings/templates/SablierV2MerkleLL_v1_2/SablierV2MerkleLL";
import { handleClaimLockup, handleClawback, handleTransferAdmin } from "../common";

export function handle_SablierV2MerkleLL_v1_2_TransferAdmin(event: TransferAdmin): void {
  handleTransferAdmin(event, {
    newAdmin: event.params.newAdmin,
    oldAdmin: event.params.oldAdmin,
  });
}

export function handle_SablierV2MerkleLL_v1_2_Claim(event: Claim): void {
  handleClaimLockup(event, {
    amount: event.params.amount,
    index: event.params.index,
    recipient: event.params.recipient,
    streamId: event.params.streamId,
    claimTo: event.params.recipient,
    
  });
}

export function handle_SablierV2MerkleLL_v1_2_Clawback(event: Clawback): void {
  handleClawback(event, {
    admin: event.params.admin,
    amount: event.params.amount,
    to: event.params.to,
  });
}
