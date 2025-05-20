import { Id } from "@envio/common/id";
import { FlowCommon } from "@envio-flow/bindings";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";

FlowCommon.CreateFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const assetId = Id.asset(event.srcAddress, event.chainId);
    const asset = await context.Asset.get(assetId);

    const batchId = Id.batch(event, event.params.sender);
    const batch = await context.Batch.get(batchId);

    const batcherId = Id.batcher(event, event.params.sender);
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
  handler: async ({ context, event, loaderReturn }) => {
    const entities = {
      asset: loaderReturn.asset ?? (await Store.Asset.create(context, event, event.params.token)),
      batch: loaderReturn.batch ?? (await Store.Batch.create(context, event, event.params.sender)),
      batcher: loaderReturn.batcher ?? (await Store.Batcher.create(context, event, event.params.sender)),
      watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event)),
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
  },
});
