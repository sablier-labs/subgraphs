import { dataSource, type ethereum } from "@graphprotocol/graph-ts";
import { getChainId, log_exit, one, zero } from "../constants";
import { Action } from "../generated/types/schema";
import { generateCampaignId, getCampaignById } from "./campaign";
import { getOrCreateWatcher } from "./watcher";

export function getActionById(id: string): Action | null {
  return Action.load(id);
}

export function createAction(event: ethereum.Event, category: string): Action | null {
  const watcher = getOrCreateWatcher();
  const id = generateActionId(event);
  const entity = new Action(id);

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
    const campaignId = generateCampaignId(dataSource.address());
    const campaign = getCampaignById(campaignId);
    if (campaign == null) {
      log_exit("Campaign hasn't been registered before this action event: action={}, campaign=", [id, campaignId]);
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
  return "".concat(event.transaction.hash.toHexString()).concat("-").concat(event.logIndex.toString());
}
