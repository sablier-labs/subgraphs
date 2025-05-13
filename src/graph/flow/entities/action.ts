import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../common/constants";
import { getChainId } from "../../common/context";
import { getActionId } from "../../common/ids";
import { ActionParams } from "../../common/params";
import { EntityAction } from "../bindings";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityAction(event: ethereum.Event, params: ActionParams): EntityAction {
  const id = getActionId(event);
  const action = new EntityAction(id);

  // Watcher
  const watcher = getOrCreateEntityWatcher();
  action.subgraphId = watcher.actionCounter;
  watcher.actionCounter = watcher.actionCounter.plus(ONE);
  watcher.save();

  // Action: general fields
  action.block = event.block.number;
  action.chainId = getChainId();
  action.contract = event.address;
  action.fee = event.transaction.value;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;

  // Action: specific fields
  action.addressA = params.addressA;
  action.addressB = params.addressB;
  action.amountA = params.amountA;
  action.amountB = params.amountB;
  action.category = params.category;
  action.stream = params.streamId;

  action.save();
  return action;
}
