import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../constants";
import { getChainId } from "../../getters";
import { logError } from "../../logger";
import { EntityAction, EntityContract } from "../bindings";
import { getOrCreateWatcher } from "./watcher";

export function createAction(event: ethereum.Event): EntityAction {
  const watcher = getOrCreateWatcher();
  const id = generateActionId(event);
  const action = new EntityAction(id);

  action.block = event.block.number;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;
  action.subgraphId = watcher.actionIndex;
  action.chainId = getChainId();
  action.fee = event.transaction.value;

  /** --------------- */
  const contractId = dataSource.address().toHexString();
  const contract = EntityContract.load(contractId);
  if (contract == null) {
    logError("Contract not saved before this action event: {}", [contractId]);
  } else {
    action.contract = contract.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(ONE);
  watcher.save();

  return action;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

// TODO: add example
export function generateActionId(event: ethereum.Event): string {
  const hash = event.transaction.hash.toHexString();
  const index = event.logIndex.toString();
  return `${hash}-${index}`;
}
