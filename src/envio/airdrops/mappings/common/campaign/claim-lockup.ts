import { Id } from "../../../../common/id";
import type { Entity } from "../../../bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_Claim_handler as HandlerLL_v1_1,
  SablierV2MerkleLL_v1_2_Claim_handler as HandlerLL_v1_2,
  SablierMerkleLL_v1_3_Claim_handler as HandlerLL_v1_3,
  SablierMerkleLL_v1_4_Claim_handler as HandlerLL_v1_4,
  SablierV2MerkleLT_v1_2_Claim_handler as HandlerLT_v1_2,
  SablierMerkleLT_v1_3_Claim_handler as HandlerLT_v1_3,
  SablierMerkleLT_v1_4_Claim_handler as HandlerLT_v1_4,
  SablierV2MerkleStreamerLL_v1_1_Claim_loader as LoaderLL_v1_1,
  SablierV2MerkleLL_v1_2_Claim_loader as LoaderLL_v1_2,
  SablierMerkleLL_v1_3_Claim_loader as LoaderLL_v1_3,
  SablierMerkleLL_v1_4_Claim_loader as LoaderLL_v1_4,
  SablierV2MerkleLT_v1_2_Claim_loader as LoaderLT_v1_2,
  SablierMerkleLT_v1_3_Claim_loader as LoaderLT_v1_3,
  SablierMerkleLT_v1_4_Claim_loader as LoaderLT_v1_4,
} from "../../../bindings/src/Types.gen";
import { isVersionWithFees } from "../../../helpers";
import { Store } from "../../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */

type LoaderReturn = {
  activity?: Entity.Activity;
  campaign: Entity.Campaign;
  watcher: Entity.Watcher;
};

type Loader<T> = LoaderLL_v1_1<T> &
  LoaderLL_v1_2<T> &
  LoaderLL_v1_3<T> &
  LoaderLL_v1_4<T> &
  LoaderLT_v1_2<T> &
  LoaderLT_v1_3<T> &
  LoaderLT_v1_4<T>;

const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const activityId = Id.activity(event);
  const activity = await context.Activity.get(activityId);

  const campaignId = Id.campaign(event.chainId, event.srcAddress);
  const campaign = await context.Campaign.getOrThrow(campaignId);

  const watcherId = event.chainId.toString();
  const watcher = await context.Watcher.getOrThrow(watcherId);

  return {
    activity,
    campaign,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = HandlerLL_v1_1<T> &
  HandlerLL_v1_2<T> &
  HandlerLL_v1_3<T> &
  HandlerLL_v1_4<T> &
  HandlerLT_v1_2<T> &
  HandlerLT_v1_3<T> &
  HandlerLT_v1_4<T>;

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { campaign, watcher } = loaderReturn;
  const activity = loaderReturn.activity ?? (await Store.Activity.create(context, event, campaign.id));

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateClaimed(context, campaign, event.params.amount);

  /* -------------------------------- ACTIVITY -------------------------------- */
  await Store.Activity.update(context, activity, event.params.amount);

  /* --------------------------------- ACTION --------------------------------- */
  let fee: bigint | undefined;
  if (isVersionWithFees(event.chainId, campaign.factory_id)) {
    fee = event.transaction.value;
  }
  const entities = { campaign, watcher };
  await Store.Action.create(context, event, entities, {
    category: "Claim",
    claimAmount: event.params.amount,
    claimIndex: event.params.index,
    claimRecipient: event.params.recipient,
    claimTokenId: event.params.streamId,
    fee,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const claimLockup = { handler, loader };
