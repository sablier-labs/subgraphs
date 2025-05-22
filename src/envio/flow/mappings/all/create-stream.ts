import { Id } from "@envio-common/id";
import { type Entity, SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type {
  SablierFlow_v1_0_CreateFlowStream_handler as Handler,
  SablierFlow_v1_0_CreateFlowStream_loader as Loader,
} from "@envio-flow/bindings/src/Types.gen";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";

/* -------------------------------------------------------------------------- */
/*                                   LOADER                                   */
/* -------------------------------------------------------------------------- */
type LoaderReturn = {
  asset: Entity.Asset | undefined;
  batch: Entity.Batch | undefined;
  batcher: Entity.Batcher | undefined;
  watcher: Entity.Watcher | undefined;
};
const loader: Loader<LoaderReturn> = async ({ context, event }) => {
  const asset = await Store.Asset.get(context, event.chainId, event.params.token);

  const batchId = Id.batch(event, event.params.sender);
  const batch = await context.Batch.get(batchId);

  const batcherId = Id.batcher(event.chainId, event.params.sender);
  const batcher = await context.Batcher.get(batcherId);

  const watcher = await Store.Watcher.get(context, event.chainId);

  return {
    asset,
    batch,
    batcher,
    watcher,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */
const handler: Handler<LoaderReturn> = async ({ context, event, loaderReturn }) => {
  const entities = {
    asset: loaderReturn.asset ?? (await Store.Asset.create(context, event.chainId, event.params.token)),
    batch: loaderReturn.batch ?? (await Store.Batch.create(context, event, event.params.sender)),
    batcher: loaderReturn.batcher ?? (await Store.Batcher.create(context, event, event.params.sender)),
    watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event.chainId)),
  };

  const stream = await Store.Stream.create(context, event, entities, {
    recipient: event.params.recipient,
    ratePerSecond: event.params.ratePerSecond,
    sender: event.params.sender,
    tokenId: event.params.streamId,
    transferable: event.params.transferable,
  });

  await Store.Action.create(context, event, entities.watcher, {
    category: enums.ActionCategory.Create,
    addressA: event.params.sender,
    addressB: event.params.recipient,
    amountA: event.params.ratePerSecond,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader, handler };

SablierFlow_v1_0.CreateFlowStream.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.CreateFlowStream.handlerWithLoader(handlerWithLoader);
