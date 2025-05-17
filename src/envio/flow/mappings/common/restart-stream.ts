import { Flow as enums } from "../../../../schema/enums";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";
import { scale } from "../../helpers";

SablierFlow_v1_0.RestartFlowStream.handlerWithLoader({
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

    // Restart is actually an adjustment
    const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
    const notWithdrawnAmount = stream.snapshotAmount - withdrawnAmount;

    const now = BigInt(event.block.timestamp);
    let depletionTime = now;
    if (availableAmount > notWithdrawnAmount) {
      const extraAmountScaled = availableAmount - notWithdrawnAmount;

      depletionTime = now + extraAmountScaled / event.params.ratePerSecond;
    }

    stream = {
      ...stream,
      paused: false,
      pausedTime: undefined,
      pausedAction_id: undefined,
      lastAdjustmentTimestamp: now,
      ratePerSecond: event.params.ratePerSecond,
      depletionTime,
    };

    /* --------------------------------- ACTION --------------------------------- */
    const action = await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Restart,
      addressA: event.params.sender,
      amountA: event.params.ratePerSecond,
      streamId: stream.id,
    });
    stream = {
      ...stream,
      lastAdjustmentAction_id: action.id,
    };
    context.Stream.set(stream);
  },
});
