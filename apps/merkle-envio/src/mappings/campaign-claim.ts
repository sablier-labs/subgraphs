import {
  MerkleInstant,
  MerkleLockupV21,
  MerkleLockupV22,
  MerkleLockupV23,
} from "../../generated";
import type {
  Action,
  ClaimHandler,
  ClaimLoader,
  InstantClaimHandler,
  InstantClaimLoader,
} from "../types";

import {
  createAction,
  generateStreamId,
  generateCampaignId,
  getOrCreateWatcher,
  getCampaign,
  generateActivityId,
  getOrCreateActivity,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: ClaimLoader) {
  const { context, event } = input;

  const campaignId = generateCampaignId(event, event.srcAddress);
  const activityId = generateActivityId(event, campaignId);
  const watcherId = event.chainId.toString();

  const [activity, campaign, watcher] = await Promise.all([
    context.Activity.get(activityId),
    context.Campaign.get(campaignId),
    context.Watcher.get(watcherId),
  ]);

  return {
    activity,
    campaign,
    watcher,
  };
}

async function instantLoader(input: InstantClaimLoader) {
  const { context, event } = input;

  const campaignId = generateCampaignId(event, event.srcAddress);
  const activityId = generateActivityId(event, campaignId);
  const watcherId = event.chainId.toString();

  const [activity, campaign, watcher] = await Promise.all([
    context.Activity.get(activityId),
    context.Campaign.get(campaignId),
    context.Watcher.get(watcherId),
  ]);

  return {
    activity,
    campaign,
    watcher,
  };
}

async function handler(input: ClaimHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let campaign =
    loaded.campaign ?? (await getCampaign(event, context.Campaign.get));
  let activity =
    loaded.activity ??
    (await getOrCreateActivity(event, campaign?.id, context.Activity.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Claim,
    campaign_id: campaign.id,
    /** --------------- */
    fee: event.transaction.value,
    claimIndex: BigInt(event.params.index),
    claimAmount: BigInt(event.params.amount),
    claimRecipient: event.params.recipient.toLowerCase(),
    claimTokenId: BigInt(event.params.streamId),
    claimStreamId: generateStreamId(
      event,
      campaign.lockup,
      event.params.streamId,
    ),
  };

  watcher = post_action.watcher;

  const campaignClaimedAmount =
    BigInt(campaign.claimedAmount) + BigInt(event.params.amount);
  const campaignClaimedCount = BigInt(campaign.claimedCount) + 1n;

  campaign = {
    ...campaign,
    claimedAmount: campaignClaimedAmount,
    claimedCount: campaignClaimedCount,
  };

  /** ------- Process: Activity -------- */

  const activityClaims = BigInt(activity.claims) + BigInt(1n);
  const activityAmount = BigInt(activity.amount) + BigInt(event.params.amount);

  activity = {
    ...activity,
    claims: activityClaims,
    amount: activityAmount,
  };

  context.Action.set(action);
  context.Activity.set(activity);
  context.Campaign.set(campaign);
  context.Watcher.set(watcher);
}

async function instantHandler(
  input: InstantClaimHandler<typeof instantLoader>,
) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher =
    loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let campaign =
    loaded.campaign ?? (await getCampaign(event, context.Campaign.get));
  let activity =
    loaded.activity ??
    (await getOrCreateActivity(event, campaign?.id, context.Activity.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Claim,
    campaign_id: campaign.id,
    /** --------------- */
    fee: event.transaction.value,
    claimIndex: BigInt(event.params.index),
    claimAmount: BigInt(event.params.amount),
    claimRecipient: event.params.recipient.toLowerCase(),
  };

  watcher = post_action.watcher;

  const campaignClaimedAmount =
    BigInt(campaign.claimedAmount) + BigInt(event.params.amount);
  const campaignClaimedCount = BigInt(campaign.claimedCount) + 1n;

  campaign = {
    ...campaign,
    claimedAmount: campaignClaimedAmount,
    claimedCount: campaignClaimedCount,
  };

  /** ------- Process: Activity -------- */

  const activityClaims = BigInt(activity.claims) + BigInt(1n);
  const activityAmount = BigInt(activity.amount) + BigInt(event.params.amount);

  activity = {
    ...activity,
    claims: activityClaims,
    amount: activityAmount,
  };

  context.Action.set(action);
  context.Activity.set(activity);
  context.Campaign.set(campaign);
  context.Watcher.set(watcher);
}

MerkleLockupV21.Claim.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV22.Claim.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV23.Claim.handlerWithLoader({
  loader,
  handler,
});

MerkleInstant.Claim.handlerWithLoader({
  loader: instantLoader,
  handler: instantHandler,
});
