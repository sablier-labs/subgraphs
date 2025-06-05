import { Flow as enums } from "../../../../schema/enums";
import { Effects } from "../../../common/effects";
import { Id } from "../../../common/id";
import { CommonStore } from "../../../common/store";
import type { ERC20Metadata } from "../../../common/types";
import { type Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_CreateFlowStream_handler as Handler,
  SablierFlow_v1_0_CreateFlowStream_loader as Loader,
} from "../../bindings/src/Types.gen";
import { Store } from "../../store";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  asset?: Entity.Asset;
  assetMetadata: ERC20Metadata;
  batch?: Entity.Batch;
  batcher?: Entity.Batcher;
  watcher?: Entity.Watcher;
};
const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const assetMetadata = await context.effect(Effects.ERC20.readOrFetchMetadata, {
    address: event.params.token,
    chainId: event.chainId,
  });
  const assetId = Id.asset(event.chainId, event.params.token);
  const asset = await context.Asset.get(assetId);

  const batchId = Id.batch(event, event.params.sender);
  const batch = await context.Batch.get(batchId);

  const batcherId = Id.batcher(event.chainId, event.params.sender);
  const batcher = await context.Batcher.get(batcherId);

  const watcherId = event.chainId.toString();
  const watcher = await context.Watcher.get(watcherId);

  return {
    asset,
    assetMetadata,
    batch,
    batcher,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const { assetMetadata } = loaderReturn;
  const entities = {
    asset:
      loaderReturn.asset ?? (await CommonStore.Asset.create(context, event.chainId, event.params.token, assetMetadata)),
    batch: loaderReturn.batch ?? (await Store.Batch.create(event, event.params.sender)),
    batcher: loaderReturn.batcher ?? (await Store.Batcher.create(event, event.params.sender)),
    watcher: loaderReturn.watcher ?? (await CommonStore.Watcher.create(context, event.chainId)),
  };

  const stream = await Store.Stream.create(context, event, {
    entities,
    ratePerSecond: event.params.ratePerSecond,
    recipient: event.params.recipient,
    sender: event.params.sender,
    tokenId: event.params.streamId,
    transferable: event.params.transferable,
  });

  await Store.Action.create(context, event, {
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    category: enums.ActionCategory.Create,
    streamId: stream.id,
    watcher: entities.watcher,
  });
};

/* -------------------------------------------------------------------------- */
/*                                   EXPORT                                   */
/* -------------------------------------------------------------------------- */

export const createStream = { handler, loader };
