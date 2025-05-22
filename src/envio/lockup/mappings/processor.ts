/**
 * @file Processors are reusable logic that is used in multiple event handlers.
 */

import type { Event } from "@envio-common/bindings";
import { type Context, type Entity } from "@envio-lockup/bindings";
import { type CreateEntities, type Params } from "@envio-lockup/helpers/types";
import { Store } from "@envio-lockup/store";
import { Lockup as enums } from "@src/schema/enums";
import { type Loader } from "./loader";

export namespace Processor {
  /* -------------------------------------------------------------------------- */
  /*                                   CANCEL                                   */
  /* -------------------------------------------------------------------------- */

  export async function cancel(
    context: Context.Handler,
    event: Event,
    loaderReturn: Loader.BaseReturn,
    params: Params.Cancel,
  ): Promise<void> {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

    /* --------------------------------- STREAM --------------------------------- */
    stream = {
      ...stream,
      cancelable: false,
      canceled: true,
      canceledTime: BigInt(event.block.timestamp),
      intactAmount: params.recipientAmount,
    };

    /* --------------------------------- ACTION --------------------------------- */
    const action = await Store.Action.create(context, event, watcher, {
      addressA: params.sender,
      addressB: params.recipient,
      amountA: params.senderAmount,
      amountB: params.recipientAmount,
      category: enums.ActionCategory.Cancel,
      streamId: stream.id,
    });
    stream = {
      ...stream,
      canceledAction_id: action.id,
    };
    await context.Stream.set(stream);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   CREATE                                   */
  /* -------------------------------------------------------------------------- */
  export namespace Create {
    type Input = {
      context: Context.Handler;
      event: Event;
      loaderReturn: Loader.CreateReturn;
      params: Params.CreateLinear | Params.CreateDynamic | Params.CreateTranche;
    };

    export async function linear(input: Input): Promise<Entity.Stream> {
      const { context, event, loaderReturn, params } = input;
      const entities = await loadEntities(context, loaderReturn, event, params);
      const stream = await Store.Stream.createLinear(context, event, entities, params as Params.CreateLinear);
      await action(context, event, entities.watcher, params, stream.id);
      return stream;
    }

    export async function dynamic(input: Input): Promise<Entity.Stream> {
      const { context, event, loaderReturn, params } = input;
      const entities = await loadEntities(context, loaderReturn, event, params);
      const stream = await Store.Stream.createDynamic(context, event, entities, params as Params.CreateDynamic);
      await action(context, event, entities.watcher, params, stream.id);
      return stream;
    }

    export async function tranched(input: Input): Promise<Entity.Stream> {
      const { context, event, loaderReturn, params } = input;
      const entities = await loadEntities(context, loaderReturn, event, params);
      const stream = await Store.Stream.createTranched(context, event, entities, params as Params.CreateTranche);
      await action(context, event, entities.watcher, params, stream.id);
      return stream;
    }

    type EventParams = {
      asset: string;
      sender: string;
    };

    async function loadEntities(
      context: Context.Handler,
      loaderReturn: Loader.CreateReturn,
      event: Event,
      params: EventParams,
    ): Promise<CreateEntities> {
      return {
        asset: loaderReturn.asset ?? (await Store.Asset.create(context, event.chainId, params.asset)),
        batch: loaderReturn.batch ?? (await Store.Batch.create(context, event, params.sender)),
        batcher: loaderReturn.batcher ?? (await Store.Batcher.create(context, event, params.sender)),
        watcher: loaderReturn.watcher ?? (await Store.Watcher.create(event.chainId)),
      };
    }

    async function action(
      context: Context.Handler,
      event: Event,
      watcher: Entity.Watcher,
      params: Params.CreateCommon,
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
  }

  /* -------------------------------------------------------------------------- */
  /*                                  WITHDRAW                                  */
  /* -------------------------------------------------------------------------- */

  export async function withdraw(
    context: Context.Handler,
    event: Event,
    loaderReturn: Loader.BaseReturn,
    params: Params.Withdraw,
  ): Promise<void> {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

    /* --------------------------------- STREAM --------------------------------- */
    const withdrawAmount = params.amount;
    const totalWithdrawnAmount = stream.withdrawnAmount + withdrawAmount;

    let intactAmount: bigint = 0n;
    if (stream.canceledAction_id) {
      intactAmount = stream.intactAmount - withdrawAmount; // Subtract the intact amount set in the cancel action
    } else {
      intactAmount = stream.depositAmount - totalWithdrawnAmount;
    }
    stream = {
      ...stream,
      intactAmount,
      withdrawnAmount: totalWithdrawnAmount,
    };
    await context.Stream.set(stream);

    /* --------------------------------- ACTION --------------------------------- */
    await Store.Action.create(context, event, watcher, {
      addressA: event.transaction.from?.toLowerCase(),
      addressB: params.to,
      amountB: params.amount,
      category: enums.ActionCategory.Withdraw,
      streamId: stream.id,
    });
  }
}
