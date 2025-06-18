import { ADDRESS_ZERO } from "../../../../common/constants";
import { Id } from "../../../../common/id";
import { type Entity } from "../../../bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_handler as HandlerLL_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_handler as HandlerLL_v1_2,
  SablierMerkleLL_v1_3_TransferAdmin_handler as HandlerLL_v1_3,
  SablierMerkleLL_v1_4_TransferAdmin_handler as HandlerLL_v1_4,
  SablierV2MerkleLT_v1_2_TransferAdmin_handler as HandlerLT_v1_2,
  SablierMerkleLT_v1_3_TransferAdmin_handler as HandlerLT_v1_3,
  SablierMerkleLT_v1_4_TransferAdmin_handler as HandlerLT_v1_4,
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_loader as LoaderLL_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_loader as LoaderLL_v1_2,
  SablierMerkleLL_v1_3_TransferAdmin_loader as LoaderLL_v1_3,
  SablierMerkleLL_v1_4_TransferAdmin_loader as LoaderLL_v1_4,
  SablierV2MerkleLT_v1_2_TransferAdmin_loader as LoaderLT_v1_2,
  SablierMerkleLT_v1_3_TransferAdmin_loader as LoaderLT_v1_3,
  SablierMerkleLT_v1_4_TransferAdmin_loader as LoaderLT_v1_4,
} from "../../../bindings/src/Types.gen";
import { Store } from "../../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  campaign?: Entity.Campaign;
  watcher?: Entity.Watcher;
};

type Loader<T> = LoaderLL_v1_1<T> &
  LoaderLL_v1_2<T> &
  LoaderLL_v1_3<T> &
  LoaderLL_v1_4<T> &
  LoaderLT_v1_2<T> &
  LoaderLT_v1_3<T> &
  LoaderLT_v1_4<T>;

export const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin === ADDRESS_ZERO) {
    return { campaign: undefined, watcher: undefined };
  }

  const campaignId = Id.campaign(event.chainId, event.srcAddress);
  const campaign = await context.Campaign.getOrThrow(campaignId);

  const watcherId = event.chainId.toString();
  const watcher = await context.Watcher.getOrThrow(watcherId);

  return {
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
  if (!campaign || !watcher) {
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateAdmin(context, campaign, event.params.newAdmin);

  /* --------------------------------- ACTION --------------------------------- */
  const entities = { campaign, watcher };
  await Store.Action.create(context, event, entities, {
    category: "TransferAdmin",
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const transferAdmin = { handler, loader };
