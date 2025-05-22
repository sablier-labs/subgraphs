import { Contract, type Entity } from "@envio-airdrops/bindings";
import type {
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_handler as Handler,
  SablierV2MerkleStreamerLL_v1_1_TransferAdmin_loader as Loader,
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

const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { campaign } = loaderReturn;

  // Starting with v1.3, the constructor emits a TransferAdmin event.
  if (event.params.oldAdmin.toLowerCase() === ADDRESS_ZERO.toLowerCase()) {
    return;
  }

  /* -------------------------------- CAMPAIGN -------------------------------- */
  await Store.Campaign.updateAdmin(context, event, campaign, event.params.newAdmin);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, loaderReturn, {
    category: enums.ActionCategory.TransferAdmin,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader, handler };

Contract.Campaign.MerkleStreamerLL_v1_1.TransferAdmin.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleLL_v1_2.TransferAdmin.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_2.TransferAdmin.handlerWithLoader(handlerWithLoader);

Contract.Campaign.MerkleInstant_v1_3.TransferAdmin.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLL_v1_3.TransferAdmin.handlerWithLoader(handlerWithLoader);
Contract.Campaign.MerkleLT_v1_3.TransferAdmin.handlerWithLoader(handlerWithLoader);
