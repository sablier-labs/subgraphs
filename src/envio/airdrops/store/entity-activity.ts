import type { Context, Entity } from "@envio-airdrops/bindings";
import type { Event } from "@envio-common/bindings";
import { Id } from "@envio-common/id";

export async function create(context: Context.Handler, event: Event, campaignId: string): Promise<Entity.Activity> {
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

export async function get(context: Context.Loader, event: Event): Promise<Entity.Activity | undefined> {
  return await context.Activity.get(Id.activity(event));
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
