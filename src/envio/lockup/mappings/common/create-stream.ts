/**
 * @file Processors are reusable logic that is used in multiple event handlers.
 */

import type { Envio } from "../../../common/bindings";
import { CommonStore } from "../../../common/store";
import { type Context, type Entity } from "../../bindings";
import { type Params } from "../../helpers/types";
import { Store } from "../../store";
import { type Loader } from "./loader";

type Input = {
  context: Context.Handler;
  event: Envio.Event;
  loaderReturn: Loader.CreateReturn;
  params: Params.CreateStreamLinear | Params.CreateStreamDynamic | Params.CreateTranche;
};

export async function createLinearStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;

  /* --------------------------------- STREAM --------------------------------- */
  const entities = await createAssociatedEntities(context, event, loaderReturn, params);
  const stream = await Store.Stream.createLinear(context, event, entities, params as Params.CreateStreamLinear);

  /* --------------------------------- ACTION --------------------------------- */
  await createAction(context, event, entities.watcher, params, stream.id);

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementCounters(context, entities.watcher);

  return stream;
}

export async function createDynamicStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;

  /* --------------------------------- STREAM --------------------------------- */
  const entities = await createAssociatedEntities(context, event, loaderReturn, params);
  const stream = await Store.Stream.createDynamic(context, event, entities, params as Params.CreateStreamDynamic);

  /* --------------------------------- ACTION --------------------------------- */
  await createAction(context, event, entities.watcher, params, stream.id);

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementCounters(context, entities.watcher);

  return stream;
}

export async function createTranchedStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;

  /* --------------------------------- STREAM --------------------------------- */
  const entities = await createAssociatedEntities(context, event, loaderReturn, params);
  const stream = await Store.Stream.createTranched(context, event, entities, params as Params.CreateTranche);

  /* --------------------------------- ACTION --------------------------------- */
  await createAction(context, event, entities.watcher, params, stream.id);

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementCounters(context, entities.watcher);

  return stream;
}

/* -------------------------------------------------------------------------- */
/*                               INTERNAL LOGIC                               */
/* -------------------------------------------------------------------------- */

async function createAction(
  context: Context.Handler,
  event: Envio.Event,
  watcher: Entity.Watcher,
  params: Params.CreateStreamCommon,
  streamId: string,
): Promise<void> {
  await Store.Action.create(context, event, watcher, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.depositAmount,
    category: "Create",
    streamId: streamId,
  });
}

async function createAssociatedEntities(
  context: Context.Handler,
  event: Envio.Event,
  loaderReturn: Loader.CreateReturn,
  params: {
    asset: string;
    sender: string;
  },
): Promise<Params.CreateEntities> {
  const { entities, rpcData } = loaderReturn;
  return {
    asset:
      entities.asset ?? (await CommonStore.Asset.create(context, event.chainId, params.asset, rpcData.assetMetadata)),
    batch: entities.batch ?? (await Store.Batch.create(event, params.sender)),
    batcher: entities.batcher ?? (await Store.Batcher.create(context, event, params.sender)),
    watcher: entities.watcher ?? CommonStore.Watcher.create(event.chainId),
  };
}
