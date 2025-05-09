import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../constants";
import { getChainId } from "../../context";
import { getActionId } from "../../ids";
import { ActionParams } from "../../params";
import { EntityAction } from "../bindings";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityAction(event: ethereum.Event, category: string, params: ActionParams): EntityAction {
  const actionId = getActionId(event);
  const action = new EntityAction(actionId);

  action.block = event.block.number;
  action.chainId = getChainId();
  action.fee = event.transaction.value;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;

  action.addressA = params.addressA;
  action.addressB = params.addressB;
  action.amountA = params.amountA;
  action.amountB = params.amountB;
  action.category = category;
  action.stream = params.streamId;

  const watcher = getOrCreateEntityWatcher();
  action.subgraphId = watcher.actionIndex;
  watcher.actionIndex = watcher.actionIndex.plus(ONE);
  watcher.save();

  action.contract = dataSource.address();
  action.save();
  return action;
}
