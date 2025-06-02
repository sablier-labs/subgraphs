/**
 * @file Processors are reusable logic that is used in multiple event handlers.
 */

import type { Envio } from "@envio-common/bindings";
import { Store as CommonStore } from "@envio-common/store";
import { type Context, type Entity } from "@envio-lockup/bindings";
import { type CreateEntities, type Params } from "@envio-lockup/helpers/types";
import { type Loader } from "@envio-lockup/mappings/common/loader";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";

type Input = {
  context: Context.Handler;
  event: Envio.Event;
  loaderReturn: Loader.CreateReturn;
  params: Params.CreateStreamLinear | Params.CreateStreamDynamic | Params.CreateTranche;
};

export async function createLinearStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createLinear(context, event, entities, params as Params.CreateStreamLinear);
  await createAction(context, event, entities.watcher, params, stream.id);
  return stream;
}

export async function createDynamicStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createDynamic(context, event, entities, params as Params.CreateStreamDynamic);
  await createAction(context, event, entities.watcher, params, stream.id);
  return stream;
}

export async function createTranchedStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createTranched(context, event, entities, params as Params.CreateTranche);
  await createAction(context, event, entities.watcher, params, stream.id);
  return stream;
}

type EventParams = {
  asset: string;
  sender: string;
};

async function loadEntities(
  context: Context.Handler,
  loaderReturn: Loader.CreateReturn,
  event: Envio.Event,
  params: EventParams,
): Promise<CreateEntities> {
  return {
    asset: loaderReturn.asset ?? (await Store.Asset.create(context, event.chainId, params.asset)),
    batch: loaderReturn.batch ?? (await Store.Batch.create(event, params.sender)),
    batcher: loaderReturn.batcher ?? (await Store.Batcher.create(event, params.sender)),
    watcher: loaderReturn.watcher ?? (await CommonStore.Watcher.create(event.chainId)),
  };
}

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
    category: enums.ActionCategory.Create,
    streamId: streamId,
  });
}
