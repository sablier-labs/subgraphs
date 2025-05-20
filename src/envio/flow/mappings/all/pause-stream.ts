import { FlowCommon } from "@envio-flow/bindings";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";

FlowCommon.PauseFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const stream = await Store.Stream.getOrThrow(context, event, event.params.streamId);
    const watcher = await Store.Watcher.getOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn }) => {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

    /* --------------------------------- STREAM --------------------------------- */

    // Paused is actually an adjustment with the new rate set to zero.
    const now = BigInt(event.block.timestamp);
    const elapsedTime = now - stream.lastAdjustmentTimestamp;
    const streamedAmount = stream.ratePerSecond * elapsedTime;
    const snapshotAmount = stream.snapshotAmount + streamedAmount;

    stream = {
      ...stream,
      lastAdjustmentTimestamp: now,
      paused: true,
      pausedTime: now,
      ratePerSecond: 0n,
      snapshotAmount,
    };

    /* --------------------------------- ACTION --------------------------------- */

    const action = await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Pause,
      addressA: event.params.recipient,
      addressB: event.params.sender,
      amountA: event.params.totalDebt,
      streamId: stream.id,
    });
    stream = {
      ...stream,
      lastAdjustmentAction_id: action.id,
      pausedAction_id: action.id,
    };
    context.Stream.set(stream);
  },
});
