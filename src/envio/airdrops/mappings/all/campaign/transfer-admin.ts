import { Contract, type Entity } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_handler as Handler_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_handler as Handler_v1_2,
  SablierMerkleInstant_v1_3_TransferAdmin_handler as Handler_v1_3,
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_loader as Loader_v1_1,
  SablierV2MerkleLL_v1_2_TransferAdmin_loader as Loader_v1_2,
  SablierMerkleInstant_v1_3_TransferAdmin_loader as Loader_v1_3,
} from "@envio-airdrops/bindings/src/Types.gen";
import { Store } from "@envio-airdrops/store";
import { ADDRESS_ZERO } from "@envio-common/constants";
import { Airdrops as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  campaign: Entity.Campaign;
  watcher: Entity.Watcher;
};

type Loader<T> = Loader_v1_1<T> & Loader_v1_2<T> & Loader_v1_3<T>;

export const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const campaign = await Store.Campaign.getOrThrow(context, event);
  const watcher = await Store.Watcher.getOrThrow(context, event.chainId);

  return {
    campaign,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

type Handler<T> = Handler_v1_1<T> & Handler_v1_2<T> & Handler_v1_3<T>;

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { campaign } = loaderReturn;

  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateAdmin(context, campaign, event.params.newAdmin);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, loaderReturn, {
    category: enums.ActionCategory.TransferAdmin,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const input = { handler, loader };

Contract.Campaign.MerkleStreamerLL_v1_1.TransferAdmin.handlerWithLoader(input);

Contract.Campaign.MerkleLL_v1_2.TransferAdmin.handlerWithLoader(input);
Contract.Campaign.MerkleLT_v1_2.TransferAdmin.handlerWithLoader(input);

Contract.Campaign.MerkleInstant_v1_3.TransferAdmin.handlerWithLoader(input);
Contract.Campaign.MerkleLL_v1_3.TransferAdmin.handlerWithLoader(input);
Contract.Campaign.MerkleLT_v1_3.TransferAdmin.handlerWithLoader(input);
