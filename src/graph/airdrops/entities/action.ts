import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { ONE, ZERO } from "../../constants";
import { getChainId } from "../../context";
import { getActionId } from "../../ids";
import { logError } from "../../logger";
import { EntityAction } from "../bindings";
import { generateCampaignId, getCampaignById } from "./campaign";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityAction(event: ethereum.Event, category: string): EntityAction | null {
  const watcher = getOrCreateEntityWatcher();
  const actionId = getActionId(event);
  const action = new EntityAction(actionId);

  action.category = category;
  action.block = event.block.number;
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;
  action.subgraphId = watcher.actionIndex;
  action.fee = ZERO;
  action.chainId = getChainId();

  /** --------------- */
  if (category !== "Create") {
    const campaignId = generateCampaignId(dataSource.address());
    const campaign = getCampaignById(campaignId);
    if (campaign == null) {
      logError("Campaign not saved before this action event: action={}, campaign={}", [actionId, campaignId]);
      return null;
    }

    action.campaign = campaign.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(ONE);
  watcher.save();

  return action;
}
