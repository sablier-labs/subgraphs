import type { Entity } from "@envio-airdrops/bindings";
import { Contract } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Claim_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_Claim_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_Claim_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_Claim_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_Claim_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_Claim_loader as Loader_v1_3,
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

type Loader<T> = Loader_v1_1<T> & Loader_v1_2<T> & Loader_v1_3<T>;
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

type Handler<T> = Handler_v1_1<T> & Handler_v1_2<T> & Handler_v1_3<T>;

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

const input = { handler, loader };

Contract.Campaign.MerkleStreamerLL_v1_1.Claim.handlerWithLoader(input);

Contract.Campaign.MerkleLL_v1_2.Claim.handlerWithLoader(input);
Contract.Campaign.MerkleLT_v1_2.Claim.handlerWithLoader(input);

Contract.Campaign.MerkleLL_v1_3.Claim.handlerWithLoader(input);
Contract.Campaign.MerkleLT_v1_3.Claim.handlerWithLoader(input);
