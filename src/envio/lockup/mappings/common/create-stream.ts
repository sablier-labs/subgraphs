/**
 * @file Processors are reusable logic that is used in multiple event handlers.
 */

import { Lockup as enums } from "../../../../schema/enums";
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
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createLinear(context, event, params as Params.CreateStreamLinear);
  await createAction(context, event, entities.watcher, params, stream.id);
  return stream;
}

export async function createDynamicStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createDynamic(context, event, params as Params.CreateStreamDynamic);
  await createAction(context, event, entities.watcher, params, stream.id);
  return stream;
}

export async function createTranchedStream(input: Input): Promise<Entity.Stream> {
  const { context, event, loaderReturn, params } = input;
  const entities = await loadEntities(context, loaderReturn, event, params);
  const stream = await Store.Stream.createTranched(context, event, params as Params.CreateTranche);
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
): Promise<Params.CreateEntities> {
  return {
    asset: loaderReturn.asset ?? (await CommonStore.Asset.create(context, event.chainId, params.asset)),
    batch: loaderReturn.batch ?? (await Store.Batch.create(event, params.sender)),
    batcher: loaderReturn.batcher ?? (await Store.Batcher.create(context, event, params.sender)),
    watcher: loaderReturn.watcher ?? (await CommonStore.Watcher.create(context, event.chainId)),
  };
}

async function createAction(
  context: Context.Handler,
  event: Envio.Event,
  watcher: Entity.Watcher,
  params: Params.CreateStreamCommon,
  streamId: string,
): Promise<void> {
  await Store.Action.create(context, event, {
    addressA: params.sender,
    addressB: params.recipient,
    amountA: params.depositAmount,
    category: enums.ActionCategory.Create,
    streamId: streamId,
    watcher,
  });
}
