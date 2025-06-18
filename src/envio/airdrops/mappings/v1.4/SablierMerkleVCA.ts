import { Airdrops as enums } from "../../../../schema/enums";
import { Id } from "../../../common/id";
import { Contract } from "../../bindings";
import { Store } from "../../store";
import * as common from "../common";

Contract.Campaign.MerkleVCA_v1_4.Clawback.handlerWithLoader(common.clawback);
Contract.Campaign.MerkleVCA_v1_4.TransferAdmin.handlerWithLoader(common.transferAdmin);

// biome-ignore assist/source/useSortedKeys: handler/loader order matters
Contract.Campaign.MerkleVCA_v1_4.Claim.handlerWithLoader({
  loader: async ({ context, event }) => {
    const activityId = Id.activity(event);
    const activity = await context.Activity.getOrThrow(activityId);

    const campaignId = Id.campaign(event.chainId, event.srcAddress);
    const campaign = await context.Campaign.getOrThrow(campaignId);

    const watcherId = event.chainId.toString();
    const watcher = await context.Watcher.getOrThrow(watcherId);

    return {
      activity,
      campaign,
      watcher,
    };
  },
  handler: async ({ context, event, loaderReturn }) => {
    const { campaign, watcher } = loaderReturn;

    const activity = loaderReturn.activity ?? (await Store.Activity.create(context, event, campaign.id));

    /* -------------------------------- CAMPAIGN -------------------------------- */
    await Store.Campaign.updateClaimed(context, campaign, event.params.claimAmount);

    /* -------------------------------- ACTIVITY -------------------------------- */
    await Store.Activity.update(context, activity, event.params.claimAmount);

    /* --------------------------------- ACTION --------------------------------- */
    const actionEntities = {
      campaign,
      watcher,
    };
    await Store.Action.create(context, event, actionEntities, {
      category: enums.ActionCategory.Claim,
      claimAmount: event.params.claimAmount,
      claimIndex: event.params.index,
      claimRecipient: event.params.recipient,
      claimTo: event.params.to,
      forgoneAmount: event.params.forgoneAmount,
      fee: event.transaction.value,
    });
  },
});
