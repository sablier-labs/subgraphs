import { ethereum } from "@graphprotocol/graph-ts";
import { AIRDROPS_V1_1, AIRDROPS_V1_2, ONE } from "../../common/constants";
import { readChainId, readContractVersion } from "../../common/context";
import { Id } from "../../common/id";
import { EntityAction, EntityCampaign } from "../bindings";
import { getOrCreateWatcher } from "./entity-watcher";

export function createAction(event: ethereum.Event, campaign: EntityCampaign, category: string): EntityAction | null {
  const actionId = Id.action(event);
  const action = new EntityAction(actionId);
  const watcher = getOrCreateWatcher();

  /* --------------------------------- ACTION --------------------------------- */
  action.block = event.block.number;
  action.campaign = campaign.id;
  action.category = category;
  action.chainId = readChainId();
  action.from = event.transaction.from;
  action.hash = event.transaction.hash;
  action.subgraphId = watcher.actionCounter;
  action.timestamp = event.block.timestamp;

  // Only set the fee if it's not an old version.
  const version = readContractVersion();
  const isVersionWithFees = version !== AIRDROPS_V1_1 && version !== AIRDROPS_V1_2;
  if (isVersionWithFees) {
    action.fee = event.transaction.value;
  }
  action.save();

  /* --------------------------------- WATCHER -------------------------------- */
  watcher.actionCounter = watcher.actionCounter.plus(ONE);
  watcher.save();

  return action;
}
