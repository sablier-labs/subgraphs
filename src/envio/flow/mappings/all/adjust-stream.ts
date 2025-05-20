import { FlowCommon } from "@envio-flow/bindings";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

FlowCommon.AdjustFlowStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

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
    const action = await Store.Action.create(context, event, watcher, {
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
