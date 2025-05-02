import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../constants";
import { generateActionId } from "../../generators";
import { getChainId } from "../../getters";
import { logInfo } from "../../logger";
import { EntityAction, EntityContract } from "../bindings";
import { getOrCreateWatcher } from "./watcher";

export function createAction(event: ethereum.Event): EntityAction {
  const watcher = getOrCreateWatcher();
  const actionId = generateActionId(event);
  const action = new EntityAction(actionId);

  action.block = event.block.number;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;
  action.subgraphId = watcher.actionIndex;
  action.fee = event.transaction.value;
  action.chainId = getChainId();

  /** --------------- */
  const contractId = dataSource.address().toHexString();
  const contract = EntityContract.load(contractId);
  if (contract == null) {
    logInfo("Contract not saved before this action event: {}", [dataSource.address().toHexString()]);
  } else {
    action.contract = contract.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(ONE);
  watcher.save();

  return action;
}
