import { ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../common/constants";
import { readChainId } from "../../common/context";
import { Id } from "../../common/id";
import { ActionParams } from "../../common/params";
import { EntityAction } from "../bindings";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityAction(event: ethereum.Event, params: ActionParams): EntityAction {
  const id = Id.action(event);
  const action = new EntityAction(id);
  const watcher = getOrCreateEntityWatcher();

  // Action: transaction
  action.block = event.block.number;
  action.chainId = readChainId();
  action.contract = event.address;
  action.fee = event.transaction.value;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.subgraphId = watcher.actionCounter;
  action.timestamp = event.block.timestamp;

  // Action: params
  action.addressA = params.addressA;
  action.addressB = params.addressB;
  action.amountA = params.amountA;
  action.amountB = params.amountB;
  action.category = params.category;
  action.stream = params.streamId;
  action.save();

  // Watcher
  watcher.actionCounter = watcher.actionCounter.plus(ONE);
  watcher.save();

  return action;
}
