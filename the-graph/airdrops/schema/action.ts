import { dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { generateActionId, getChainId } from "../../shared";
import { ONE, ZERO } from "../../shared/constants";
import { EntityAction } from "../bindings";
import { generateCampaignId, getCampaignById } from "./campaign";
import { getOrCreateWatcher } from "./watcher";

export function createAction(event: ethereum.Event, category: string): EntityAction | null {
  const watcher = getOrCreateWatcher();
  const actionId = generateActionId(event);
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
      log.error("Campaign not saved before this action event: action={}, campaign=", [actionId, campaignId]);
      return null;
    }

    action.campaign = campaign.id;
  }

  /** --------------- */
  watcher.actionIndex = watcher.actionIndex.plus(ONE);
  watcher.save();

  return action;
}
