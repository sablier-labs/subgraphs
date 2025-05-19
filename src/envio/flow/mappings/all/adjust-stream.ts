import { SablierFlow } from "@envio/flow/bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "@envio/flow/entities";
import { scale } from "@envio/flow/helpers";
import { Flow as enums } from "@src/schema/enums";

SablierFlow.AdjustFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const tokenId: bigint = event.params.streamId;

    const stream = await getStreamOrThrow(context, event, tokenId);
    const watcher = await getWatcherOrThrow(context, event);

    return {
      stream,
      watcher,
    };
  },
  /* -------------------------------------------------------------------------- */
  /*                                   HANDLER                                  */
  /* -------------------------------------------------------------------------- */
  handler: async ({ context, event, loaderReturn: loaded }) => {
    const { watcher } = loaded;
    let { stream } = loaded;

    /* --------------------------------- STREAM --------------------------------- */
    const now = BigInt(event.block.timestamp);
    const elapsedTime = now - stream.lastAdjustmentTimestamp;
    const streamedAmount = stream.ratePerSecond * elapsedTime;
    const snapshotAmount = stream.snapshotAmount + streamedAmount;

    // The depletion time is recalculated only if the current depletion time is in the future.
    let depletionTime = stream.depletionTime;
    if (stream.depletionTime > now) {
      const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
      const notWithdrawn = snapshotAmount - withdrawnAmount;
      const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
      const extraAmount = availableAmount - notWithdrawn;
      depletionTime = now + extraAmount / event.params.newRatePerSecond;
    }

    // Update stream entity.
    stream = {
      ...stream,
      depletionTime,
      lastAdjustmentTimestamp: now,
      ratePerSecond: event.params.newRatePerSecond,
      snapshotAmount,
    };

    /* --------------------------------- ACTION --------------------------------- */
    const action = await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Adjust,
      amountA: event.params.oldRatePerSecond,
      amountB: event.params.newRatePerSecond,
      streamId: stream.id,
    });
    stream = {
      ...stream,
      lastAdjustmentAction_id: action.id,
    };
    context.Stream.set(stream);
  },
});
