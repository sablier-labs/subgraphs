import { Flow as enums } from "../../../../schema/enums";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";

SablierFlow_v1_0.PauseFlowStream.handlerWithLoader({
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.streamId);
    const watcher = await getWatcherOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const { watcher } = loaded;
    let { stream } = loaded;

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

    const action = await createEntityAction(context, watcher, event, {
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
