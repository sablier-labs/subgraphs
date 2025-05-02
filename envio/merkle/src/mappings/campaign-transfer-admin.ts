import { MerkleInstant, MerkleLockupV21, MerkleLockupV22, MerkleLockupV23 } from "../../generated";
import { ADDRESS_ZERO, ActionCategory } from "../constants";
import {
  createAction,
  generateCampaignId,
  generateCampaignNickname,
  getCampaign,
  getOrCreateWatcher,
} from "../helpers";
import type { Action, TransferAdminHandler, TransferAdminLoader } from "../types";

async function loader(input: TransferAdminLoader) {
  const { context, event } = input;

  const campaignId = generateCampaignId(event, event.srcAddress);
  const watcherId = event.chainId.toString();

  const [campaign, watcher] = await Promise.all([context.Campaign.get(campaignId), context.Watcher.get(watcherId)]);

  const asset = campaign?.asset_id ? await context.Asset.get(campaign?.asset_id) : undefined;

  return {
    asset,
    campaign,
    watcher,
  };
}

async function handler(input: TransferAdminHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /**
   * As described in issue #18, we will first filter out
   * any `Transfer` events emitted by the initial mint transaction
   */

  if (event.params.oldAdmin.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
    return;
  }

  /** ------- Fetch -------- */

  let watcher = loaded.watcher ?? (await getOrCreateWatcher(event, context.Watcher.get));
  let campaign = loaded.campaign ?? (await getCampaign(event, context.Campaign.get));
  const asset = loaded.asset;

  if (!asset) {
    return;
  }

  /** ------- Process -------- */

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.TransferAdmin,
    campaign_id: campaign.id,
  };

  watcher = post_action.watcher;

  campaign = {
    ...campaign,
    admin: event.params.newAdmin.toLowerCase(),
  };

  campaign = {
    ...campaign,
    nickname: generateCampaignNickname(campaign, asset),
  };

  context.Action.set(action);
  context.Campaign.set(campaign);
  context.Watcher.set(watcher);
}

MerkleLockupV21.TransferAdmin.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV22.TransferAdmin.handlerWithLoader({
  loader,
  handler,
});

MerkleLockupV23.TransferAdmin.handlerWithLoader({
  loader,
  handler,
});

MerkleInstant.TransferAdmin.handlerWithLoader({
  loader,
  handler,
});
