import { dataSource, ethereum } from "@graphprotocol/graph-ts";
import { Action } from "../generated/types/schema";
import { getChainId, log_exit, one, zero } from "../constants";
import { generateCampaignId, getCampaignById } from "./campaign";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(
  event: ethereum.Event,
  category: string,
): Action | null {
  let watcher = getOrCreateWatcher();
  let id = generateActionId(event);
  let entity = new Action(id);

  entity.category = category;
  entity.block = event.block.number;
  entity.from = event.transaction.from;
  entity.hash = event.transaction.hash;
  entity.timestamp = event.block.timestamp;
  entity.subgraphId = watcher.actionIndex;
  entity.fee = zero;
  entity.chainId = getChainId();

  /** --------------- */
  if (category !== "Create") {
    let campaignId = generateCampaignId(dataSource.address());
    let campaign = getCampaignById(campaignId);
    if (campaign == null) {
      log_exit(
        "Campaign hasn't been registered before this action event: action={}, campaign=",
        [id, campaignId],
      );
      return null;
    }

    entity.campaign = campaign.id;
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
