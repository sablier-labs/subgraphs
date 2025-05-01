import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Activity } from "../generated/types/schema";
import { log_exit, zero } from "../constants";
import { getCampaignById } from "./campaign";

export function getActivityById(id: string): Activity | null {
  return Activity.load(id);
}

export function getOrCreateActivity(
  campaignId: string,
  event: ethereum.Event,
): Activity | null {
  let timestamp = event.block.timestamp.toI32();
  let day = timestamp / (60 * 60 * 24);

  /** --------------- */
  let campaign = getCampaignById(campaignId);
  if (campaign == null) {
    log_exit(
      "Campaign hasn't been registered before this activity update: {}",
      [campaignId],
    );
    return null;
  }

  /** --------------- */

  let id = generateActivityId(campaignId, day.toString());
  let entity = getActivityById(id);

  if (entity != null) {
    return entity;
  }

  entity = new Activity(id);
  entity.day = BigInt.fromI32(day);
  entity.campaign = campaign.id;
  entity.timestamp = event.block.timestamp;

  entity.amount = zero;
  entity.claims = zero;

  return entity;
}

/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */
/** --------------------------------------------------------------------------------------------------------- */

export function generateActivityId(campaignId: string, day: string): string {
  return ""
    .concat("activity")
    .concat("-")
    .concat(campaignId)
    .concat("-")
    .concat(day);
}
