import { ids } from "@envio/common/ids";
import { SablierFlow_v1_0 } from "@envio/flow/bindings";
import {
  createEntityAction,
  createEntityAsset,
  createEntityBatch,
  createEntityBatcher,
  createEntityStream,
  createEntityWatcher,
} from "@envio/flow/entities";
import { Flow as enums } from "@src/schema/enums";

SablierFlow_v1_0.CreateFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const assetId = ids.asset(event.srcAddress, event.chainId);
    const asset = await context.Asset.get(assetId);

    const batchId = ids.batch(event);
    const batch = await context.Batch.get(batchId);

    const batcherId = ids.batcher(event, event.params.sender);
    const batcher = await context.Batcher.get(batcherId);

    const watcherId = event.chainId.toString();
    const watcher = await context.Watcher.get(watcherId);

    return {
      asset,
      batch,
      batcher,
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const entities = {
      asset: loaded.asset ?? (await createEntityAsset(context, event, event.params.token)),
      batch: loaded.batch ?? (await createEntityBatch(context, event, event.params.sender)),
      batcher: loaded.batcher ?? (await createEntityBatcher(context, event, event.params.sender)),
      watcher: loaded.watcher ?? (await createEntityWatcher(event)),
    };

    const stream = await createEntityStream(context, entities, event);

    await createEntityAction(context, entities.watcher, event, {
      category: enums.ActionCategory.Create,
      addressA: event.params.sender,
      addressB: event.params.recipient,
      amountA: event.params.ratePerSecond,
      streamId: stream.id,
    });
  },
});
