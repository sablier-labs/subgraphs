import { MerkleInstant, MerkleLockupV21, MerkleLockupV22, MerkleLockupV23 } from "../../generated";
import { ActionCategory } from "../constants";
import { createAction, generateCampaignId, getCampaign, getOrCreateWatcher } from "../helpers";
import type { Action, ClawbackHandler, ClawbackLoader } from "../types";

async function loader(input: ClawbackLoader) {
  const { context, event } = input;

  const campaignId = generateCampaignId(event, event.srcAddress);
  const watcherId = event.chainId.toString();

  const [campaign, watcher] = await Promise.all([context.Campaign.get(campaignId), context.Watcher.get(watcherId)]);

  return {
    campaign,
    watcher,
  };
}

async function handler(input: ClawbackHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let campaign = loaded.campaign ?? (await getCampaign(event, context.Campaign.get));

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Clawback,
    campaign_id: campaign.id,
    /** --------------- */
    clawbackFrom: event.params.admin.toLowerCase(),
    clawbackTo: event.params.to.toLowerCase(),
    clawbackAmount: BigInt(event.params.amount),
  };

  watcher = post_action.watcher;

  campaign = {
    ...campaign,
    clawbackTime: BigInt(event.block.timestamp),
    clawbackAction_id: action.id,
  };

  context.Action.set(action);
  context.Campaign.set(campaign);
  context.Watcher.set(watcher);
}

MerkleLockupV21.Clawback.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV22.Clawback.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV23.Clawback.handlerWithLoader({
  loader,
  handler,
});

MerkleInstant.Clawback.handlerWithLoader({
  loader,
  handler,
});
