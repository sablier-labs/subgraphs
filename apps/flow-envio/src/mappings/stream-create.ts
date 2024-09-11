import { FlowV22 } from "../../generated";

import type { CreateLoader, CreateHandler, Action } from "../types";

import {
  createAction,
  createStream,
  generateAssetId,
  generateBatchId,
  generateBatcherId,
  generateContractIdFromEvent,
  getOrCreateAsset,
  getOrCreateBatch,
  getOrCreateBatcher,
  initialize,
} from "../helpers";
import { ActionCategory } from "../constants";

async function loader(input: CreateLoader) {
  const { context, event } = input;

  const assetId = generateAssetId(event, event.params.token);
  const batchId = generateBatchId(event);
  const batcherId = generateBatcherId(event, event.params.sender);
  const contractId = generateContractIdFromEvent(event);
  const watcherId = event.chainId.toString();

  const [asset, batch, batcher, contract, watcher] = await Promise.all([
    context.Asset.get(assetId),
    context.Batch.get(batchId),
    context.Batcher.get(batcherId),
    context.Contract.get(contractId),
    context.Watcher.get(watcherId),
  ]);

  return {
    asset,
    batch,
    batcher,
    contract,
    watcher,
  };
}

async function handler(input: CreateHandler<typeof loader>) {
  const { context, event, loaderReturn: loaded } = input;

  /** ------- Initialize -------- */

  let { watcher, contract, contracts } = await initialize(
    event,
    context.Watcher.get,
    context.Contract.get,
    loaded,
  );

  /** ------- Fetch -------- */

  let asset =
    loaded.asset ??
    (await getOrCreateAsset(event, event.params.token, context.Asset.get));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(event, event.params.sender, context.Batcher.get));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, ...post_create } = await createStream(event, {
    asset,
    batch,
    batcher,
    contract,
    watcher,
  });

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    stream_id: stream.id,
    /** --------------- */
    addressA: event.params.sender.toLowerCase(),
    addressB: event.params.recipient.toLowerCase(),
    amountA: event.params.ratePerSecond,
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

FlowV22.CreateFlowStream.handlerWithLoader({
  loader,
  handler,
});
