import { Contract } from "@envio-airdrops/bindings";
import { Store } from "@envio-airdrops/store";
import { Airdrops as enums } from "@src/schema/enums";

// biome-ignore assist/source/useSortedKeys: handler/loader order matters
Contract.Campaign.MerkleInstant_v1_3.Claim.handlerWithLoader({
  loader: async ({ context, event }) => {
    const activity = await Store.Activity.get(context, event);
    const campaign = await Store.Campaign.getOrThrow(context, event);
    const watcher = await Store.Watcher.getOrThrow(context, event.chainId);

    return {
      activity,
      campaign,
      watcher,
    };
  },
  handler: async ({ context, event, loaderReturn }) => {
    const { campaign, watcher } = loaderReturn;
    let activity = loaderReturn.activity ?? (await Store.Activity.create(context, event, campaign.id));

    /* -------------------------------- CAMPAIGN -------------------------------- */
    await Store.Campaign.updateClaimed(context, campaign, event.params.amount);

    /* -------------------------------- ACTIVITY -------------------------------- */
    await Store.Activity.update(context, activity, event.params.amount);

    /* --------------------------------- ACTION --------------------------------- */
    const actionEntities = {
      campaign,
      watcher,
    };
    await Store.Action.create(context, event, actionEntities, {
      category: enums.ActionCategory.Claim,
      claimAmount: event.params.amount,
      claimIndex: event.params.index,
      claimRecipient: event.params.recipient,
      fee: event.transaction.value,
    });
  },
});
