import { dataSource, type ethereum, log } from "@graphprotocol/graph-ts";
import { getChainId, one } from "../constants";
import { Action } from "../generated/types/schema";
import { getContractByAddress } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(event: ethereum.Event): Action {
  const watcher = getOrCreateWatcher();
  const id = generateActionId(event);
  const entity = new Action(id);

  entity.block = event.block.number;
  entity.from = event.transaction.from;
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.subgraphId = watcher.actionIndex;
  entity.fee = event.transaction.value;
  entity.chainId = getChainId();

  /** --------------- */
  const contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.debug("[SABLIER] Contract hasn't been registered before this action event: {}", [
      dataSource.address().toHexString(),
    ]);
    log.error("[SABLIER]", []);
  } else {
    entity.contract = contract.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(one);
  watcher.save();

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActionId(event: ethereum.Event): string {
  return "".concat(event.transaction.hash.toHexString()).concat("-").concat(event.logIndex.toString());
}
