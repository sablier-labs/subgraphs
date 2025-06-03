import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ONE } from "../../common/constants";
import * as Entity from "../bindings/schema";

export function createOrUpdateActivity(
  event: ethereum.Event,
  campaign: Entity.Campaign,
  amount: BigInt,
): Entity.Activity {
  const timestamp = event.block.timestamp.toU32();
  const day = timestamp / (60 * 60 * 24); // 60 seconds * 60 minutes * 24 hours
  const id = `activity-${campaign.id}-${day.toString()}`;

  let activity = Entity.Activity.load(id);
  if (activity) {
    activity.amount = activity.amount.plus(amount);
    activity.claims = activity.claims.plus(ONE);

    activity.save();
    return activity;
  }

  activity = new Entity.Activity(id);
  activity.amount = amount;
  activity.campaign = campaign.id;
  activity.claims = ONE;
  activity.day = BigInt.fromU32(day);
  activity.timestamp = event.block.timestamp;

  activity.save();
  return activity;
}
