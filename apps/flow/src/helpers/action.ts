import { dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { Action } from "../generated/types/schema";
import { getChainId, one } from "../constants";
import { getContractByAddress } from "./contract";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(event: ethereum.Event): Action {
  let watcher = getOrCreateWatcher();
  let id = generateActionId(event);
  let entity = new Action(id);

  entity.block = event.block.number;
  entity.from = event.transaction.from;
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.subgraphId = watcher.actionIndex;
  entity.chainId = getChainId();

  /** --------------- */
  let contract = getContractByAddress(dataSource.address());
  if (contract == null) {
    log.debug(
      "[SABLIER] Contract hasn't been registered before this action event: {}",
      [dataSource.address().toHexString()],
    );
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
  return ""
    .concat(event.transaction.hash.toHexString())
    .concat("-")
    .concat(event.logIndex.toString());
}
