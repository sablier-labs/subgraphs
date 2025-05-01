import type {
  Action,
  CreateDynamicHandler,
  CreateDynamicLoader,
  CreateDynamicMergedHandler,
  CreateDynamicMergedLoader,
  CreateLinearHandler,
  CreateLinearLoader,
  CreateLinearMergedHandler,
  CreateLinearMergedLoader,
  CreateTranchedHandler,
  CreateTranchedLoader,
  CreateTranchedMergedHandler,
  CreateTranchedMergedLoader,
} from "../types";
import { LockupV20, LockupV21, LockupV22, LockupV23 } from "../../generated";
import { ActionCategory } from "../constants";
import {
  createAction,
  createDynamicMergedStream,
  createDynamicStream,
  createLinearMergedStream,
  createLinearStream,
  createTranchedMergedStream,
  createTranchedStream,
  generateAssetId,
  generateBatchId,
  generateBatcherId,
  generateContractIdFromEvent,
  getOrCreateAsset,
  getOrCreateBatch,
  getOrCreateBatcher,
  initialize,
} from "../helpers";

async function loader(
  input:
    | CreateLinearLoader
    | CreateDynamicLoader
    | CreateTranchedLoader
    | CreateDynamicMergedLoader
    | CreateLinearMergedLoader
    | CreateTranchedMergedLoader,
) {
  const { context, event } = input;

  const assetId =
    "asset" in event.params
      ? generateAssetId(event, event.params.asset)
      : generateAssetId(event, event.params.commonParams[4]);
  const batchId = generateBatchId(event);
  const batcherId =
    "sender" in event.params
      ? generateBatcherId(event, event.params.sender)
      : generateBatcherId(event, event.params.commonParams[1]);
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

async function handlerDynamic(input: CreateDynamicHandler<typeof loader>) {
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
    (await getOrCreateAsset(event, event.params.asset, context.Asset.get));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(event, event.params.sender, context.Batcher.get));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, segments, ...post_create } = await createDynamicStream(event, {
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
    amountA: event.params.amounts[0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

  if (segments.length) {
    for (let i = 0; i < segments.length; i++) {
      await context.Segment.set(segments[i]);
    }
  }

  await context.Action.set(action);
  await context.Batch.set(batch);
  await context.Batcher.set(batcher);
  await context.Stream.set(stream);
  await context.Watcher.set(watcher);
}

async function handlerDynamicMerged(
  input: CreateDynamicMergedHandler<typeof loader>,
) {
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
    (await getOrCreateAsset(
      event,
      event.params.commonParams[4],
      context.Asset.get,
    ));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(
      event,
      event.params.commonParams[1],
      context.Batcher.get,
    ));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, segments, ...post_create } = await createDynamicMergedStream(
    event,
    {
      asset,
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    stream_id: stream.id,
    /** --------------- */
    addressA: event.params.commonParams[1].toLowerCase(),
    addressB: event.params.commonParams[2].toLowerCase(),
    amountA: event.params.commonParams[3][0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

  if (segments.length) {
    for (let i = 0; i < segments.length; i++) {
      await context.Segment.set(segments[i]);
    }
  }

  await context.Action.set(action);
  await context.Batch.set(batch);
  await context.Batcher.set(batcher);
  await context.Stream.set(stream);
  await context.Watcher.set(watcher);
}

async function handlerLinear(input: CreateLinearHandler<typeof loader>) {
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
    (await getOrCreateAsset(event, event.params.asset, context.Asset.get));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(event, event.params.sender, context.Batcher.get));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, ...post_create } = await createLinearStream(event, {
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
    amountA: event.params.amounts[0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

async function handlerLinearMerged(
  input: CreateLinearMergedHandler<typeof loader>,
) {
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
    (await getOrCreateAsset(
      event,
      event.params.commonParams[4],
      context.Asset.get,
    ));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(
      event,
      event.params.commonParams[1],
      context.Batcher.get,
    ));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, ...post_create } = await createLinearMergedStream(event, {
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
    addressA: event.params.commonParams[1].toLowerCase(),
    addressB: event.params.commonParams[2].toLowerCase(),
    amountA: event.params.commonParams[3][0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

async function handlerTranched(input: CreateTranchedHandler<typeof loader>) {
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
    (await getOrCreateAsset(event, event.params.asset, context.Asset.get));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(event, event.params.sender, context.Batcher.get));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, tranches, ...post_create } = await createTranchedStream(event, {
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
    amountA: event.params.amounts[0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

  if (tranches.length) {
    for (let i = 0; i < tranches.length; i++) {
      await context.Tranche.set(tranches[i]);
    }
  }

  await context.Action.set(action);
  await context.Batch.set(batch);
  await context.Batcher.set(batcher);
  await context.Stream.set(stream);
  await context.Watcher.set(watcher);
}

async function handlerTranchedMerged(
  input: CreateTranchedMergedHandler<typeof loader>,
) {
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
    (await getOrCreateAsset(
      event,
      event.params.commonParams[4],
      context.Asset.get,
    ));
  let batcher =
    loaded.batcher ??
    (await getOrCreateBatcher(
      event,
      event.params.commonParams[1],
      context.Batcher.get,
    ));
  let batch =
    loaded.batch ?? (await getOrCreateBatch(event, batcher, context.Batch.get));

  /** ------- Process -------- */

  let { stream, tranches, ...post_create } = await createTranchedMergedStream(
    event,
    {
      asset,
      batch,
      batcher,
      contract,
      watcher,
    },
  );

  batch = post_create.batch;
  batcher = post_create.batcher;
  watcher = post_create.watcher;

  const post_action = createAction(event, watcher);

  const action: Action = {
    ...post_action.entity,
    category: ActionCategory.Create,
    stream_id: stream.id,
    /** --------------- */
    addressA: event.params.commonParams[1].toLowerCase(),
    addressB: event.params.commonParams[2].toLowerCase(),
    amountA: event.params.commonParams[3][0],
  };

  watcher = post_action.watcher;

  /** ------- Non-Cancelable -------- */

  if (stream.cancelable == false) {
    stream = {
      ...stream,
      renounceAction_id: action.id,
      renounceTime: BigInt(event.block.timestamp),
    };
  }

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

  if (tranches.length) {
    for (let i = 0; i < tranches.length; i++) {
      await context.Tranche.set(tranches[i]);
    }
  }

  await context.Action.set(action);
  await context.Batch.set(batch);
  await context.Batcher.set(batcher);
  await context.Stream.set(stream);
  await context.Watcher.set(watcher);
}

LockupV20.CreateLockupDynamicStream.handlerWithLoader({
  loader,
  handler: handlerDynamic,
});

LockupV20.CreateLockupLinearStream.handlerWithLoader({
  loader,
  handler: handlerLinear,
});

LockupV21.CreateLockupDynamicStream.handlerWithLoader({
  loader,
  handler: handlerDynamic,
});

LockupV21.CreateLockupLinearStream.handlerWithLoader({
  loader,
  handler: handlerLinear,
});

LockupV22.CreateLockupDynamicStream.handlerWithLoader({
  loader,
  handler: handlerDynamic,
});

LockupV22.CreateLockupLinearStream.handlerWithLoader({
  loader,
  handler: handlerLinear,
});

LockupV22.CreateLockupTranchedStream.handlerWithLoader({
  loader,
  handler: handlerTranched,
});

LockupV23.CreateLockupDynamicStream.handlerWithLoader({
  loader,
  handler: handlerDynamicMerged,
});

LockupV23.CreateLockupLinearStream.handlerWithLoader({
  loader,
  handler: handlerLinearMerged,
});

LockupV23.CreateLockupTranchedStream.handlerWithLoader({
  loader,
  handler: handlerTranchedMerged,
});
