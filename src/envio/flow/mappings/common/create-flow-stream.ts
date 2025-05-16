import { Flow as enums } from "../../../../schema/enums";
import type { Action, CreateHandler, CreateLoader } from "../../bindings";
import {
  createAction,
  createStream,
  generateAssetId,
  generateBatchId,
  generateBatcherId,
  getOrCreateAsset,
  getOrCreateBatch,
  getOrCreateBatcher,
  initialize,
} from "../../entities";
import { FlowV10 } from "../../generated";

async function loader(input: CreateLoader) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.token);
  const batchId = generateBatchId(event);
  const batcherId = generateBatcherId(event, event.params.sender);
  const watcherId = event.chainId.toString();

  const [asset, batch, batcher, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Batch.get(batchId),
    context.Batcher.get(batcherId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    batch,
    batcher,
    watcher,
  };
}

async function handler(input: CreateHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Initialize -------- */

  let { watcher } = await initialize(event, context.Watcher.get, loaded);

  /** ------- Fetch -------- */

  const asset = loaded.asset ?? (await getOrCreateAsset(event, event.params.token, context.Asset.get));
  let batcher = loaded.batcher ?? (await getOrCreateBatcher(event, event.params.sender, context.Batcher.get));
  let batch = loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  const { stream, ...post_create } = await createStream(event, {
    asset,
    batch,
    batcher,
    watcher,
  });

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: enums.ActionCategory.Create,
    stream_id: stream.id,
    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    addressB: event.params.recipient.toLowerCase(),
    amountA: event.params.ratePerSecond /** [Scaled 18D] */,
  };

  watcher = post_action.watcher;

  /** ------- Update -------- */

  await context.Asset.set(asset);
  if (contracts.length) {
    for (let i = 0; i < contracts.length; i++) {
      if (contracts[i].id === contract.id) {
        await context.Contract.set(contract);
      }
      await context.Contract.set(contracts[i]);
    }
  }

  await context.Action.set(action);
  await context.Batch.set(batch);
  await context.Batcher.set(batcher);
  await context.Stream.set(stream);
  await context.Watcher.set(watcher);
}

FlowV10.CreateFlowStream.handlerWithLoader({
  loader,
  handler,
});
