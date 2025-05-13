import { ethereum } from "@graphprotocol/graph-ts";
import { AIRDROPS_V1_1, AIRDROPS_V1_2, ONE } from "../../common/constants";
import { getChainId, getContractVersion } from "../../common/context";
import { getActionId } from "../../common/ids";
import { EntityAction, EntityCampaign } from "../bindings";
import { getOrCreateEntityWatcher } from "./watcher";

export function createEntityAction(
  event: ethereum.Event,
  campaign: EntityCampaign,
  category: string,
): EntityAction | null {
  const actionId = getActionId(event);
  const action = new EntityAction(actionId);

  // Watcher
  const watcher = getOrCreateEntityWatcher();
  action.subgraphId = watcher.actionCounter;
  watcher.actionCounter = watcher.actionCounter.plus(ONE);
  watcher.save();

  // Action
  action.block = event.block.number;
  action.campaign = campaign.id;
  action.category = category;
  action.chainId = getChainId();
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.timestamp = event.block.timestamp;

  // Only set the fee if it's not an old version.
  const version = getContractVersion();
  const isVersionWithFees = version !== AIRDROPS_V1_1 && version !== AIRDROPS_V1_2;
  if (isVersionWithFees) {
    action.fee = event.transaction.value;
  }

  action.save();
  return action;
}
