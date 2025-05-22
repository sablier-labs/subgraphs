import type { Entity } from "@envio-airdrops/bindings";
import { Contract } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Claim_handler as Handler,
  SablierV2MerkleStreamerLL_v1_1_Claim_loader as Loader,
} from "@envio-airdrops/bindings/index";
import { isVersionWithFees } from "@envio-airdrops/helpers";
import { Store } from "@envio-airdrops/store";
import { Airdrops as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  activity: Entity.Activity | undefined;
  campaign: Entity.Campaign;
  watcher: Entity.Watcher;
};

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const activity = await Store.Activity.get(context, event);
  const campaign = await Store.Campaign.getOrThrow(context, event);
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);

  return {
    activity,
    campaign,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
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
  let fee: bigint | undefined;
  if (isVersionWithFees(event.chainId, campaign.factory_id)) {
    fee = event.transaction.value;
  }
  await Store.Action.create(context, event, actionEntities, {
    category: enums.ActionCategory.Claim,
    claimAmount: event.params.amount,
    claimIndex: event.params.index,
    claimRecipient: event.params.recipient,
    fee,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader, handler };

Contract.Campaign.MerkleStreamerLL_v1_1.Claim.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleLL_v1_2.Claim.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_2.Claim.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleLL_v1_3.Claim.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_3.Claim.handlerWithLoader(handlerWithLoader);
