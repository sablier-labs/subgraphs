import { dataSource } from "@graphprotocol/graph-ts";
import { logError } from "../../logger";
import { EntityContract, EventTransferAdmin } from "../bindings";

/**
 * TODO: rewrite this comment
 * Use the TransferAdmin event as an `onCreate` lifecycle step
 * as it's the first one to be logged after the contract's creation
 */
export function handleTransferAdmin(event: EventTransferAdmin): void {
  const contractId = dataSource.address().toHexString();
  const contract = EntityContract.load(contractId);
  if (contract == null) {
    logError("Contract not saved before this transfer admin event: {}", [contractId]);
    return;
  }

  contract.admin = event.params.newAdmin;
  contract.save();
}
