import type { Envio } from "../../common/bindings";
import type { Context, Entity } from "../bindings";

export async function create(
  context: Context.Handler,
  event: Envio.Event,
  campaignId: string,
): Promise<Entity.Activity> {
  const timestamp = event.block.timestamp;
  const day = timestamp / (60 * 60 * 24); // 60 seconds * 60 minutes * 24 hours

  const activity: Entity.Activity = {
    amount: 0n,
    campaign_id: campaignId,
    claims: 0n,
    day: BigInt(day),
    id: `activity-${campaignId}-${day}`,
    timestamp: BigInt(timestamp),
  };

  await context.Activity.set(activity);
  return activity;
}

export async function update(
  context: Context.Handler,
  activity: Entity.Activity,
  amount: bigint,
): Promise<Entity.Activity> {
  const updatedActivity: Entity.Activity = {
    ...activity,
    amount: activity.amount + amount,
    claims: activity.claims + 1n,
  };
  await context.Activity.set(updatedActivity);
  return updatedActivity;
}
