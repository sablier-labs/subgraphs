import { BigInt as BInt, ethereum } from "@graphprotocol/graph-ts";
import { ZERO } from "../../constants";
import { logError } from "../../logger";
import { EntityActivity } from "../bindings";
import { getCampaignById } from "./campaign";

export function getActivityById(id: string): EntityActivity | null {
  return EntityActivity.load(id);
}

export function getOrCreateActivity(campaignId: string, event: ethereum.Event): EntityActivity | null {
  const timestamp = event.block.timestamp.toI32();
  const day = timestamp / (60 * 60 * 24);

  /** --------------- */
  const campaign = getCampaignById(campaignId);
  if (campaign == null) {
    logError("Campaign not saved before this activity update: {}", [campaignId]);
    return null;
  }

  /** --------------- */

  const id = generateActivityId(campaignId, day.toString());
  let entity = getActivityById(id);

  if (entity != null) {
    return entity;
  }

  entity = new EntityActivity(id);
  entity.day = BInt.fromI32(day);
  entity.campaign = campaign.id;
  entity.timestamp = event.block.timestamp;

  entity.amount = ZERO;
  entity.claims = ZERO;

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

// TODO: add example
export function generateActivityId(campaignId: string, day: string): string {
  return "activity-" + campaignId + "-" + day;
}
