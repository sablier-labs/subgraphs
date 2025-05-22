import { ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../common/constants";
import { readChainId } from "../../common/context";
import { Id } from "../../common/id";
import { EntityAction, EntityCampaign } from "../bindings";
import { Params } from "../helpers/types";
import { getOrCreateWatcher } from "./entity-watcher";

export function createAction(event: ethereum.Event, campaign: EntityCampaign, params: Params.Action): EntityAction {
  const actionId = Id.action(event);
  const action = new EntityAction(actionId);
  const watcher = getOrCreateWatcher();

  /* --------------------------------- ACTION --------------------------------- */
  action.block = event.block.number;
  action.campaign = campaign.id;
  action.category = params.category;
  action.chainId = readChainId();
  action.claimAmount = params.claimAmount;
  action.claimIndex = params.claimIndex;
  action.claimRecipient = params.claimRecipient;
  action.claimStreamId = params.claimStreamId;
  action.claimTokenId = params.claimTokenId;
  action.clawbackAmount = params.clawbackAmount;
  action.clawbackFrom = params.clawbackFrom;
  action.fee = params.fee;
  action.hash = event.transaction.hash;
  action.subgraphId = watcher.actionCounter;
  action.timestamp = event.block.timestamp;

  /* --------------------------------- WATCHER -------------------------------- */
  watcher.actionCounter = watcher.actionCounter.plus(ONE);
  watcher.save();

  return action;
}
