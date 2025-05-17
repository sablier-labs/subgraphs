import { Flow as enums } from "../../../../schema/enums";
import { SablierFlow_v1_0 } from "../../bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "../../entities";
import { scale } from "../../helpers";

SablierFlow_v1_0.RefundFromFlowStream.handlerWithLoader({
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

    const refundedAmount = stream.refundedAmount + event.params.amount;
    const availableAmount = stream.availableAmount - event.params.amount;
    const scaledAvailableAmount = scale(availableAmount, stream.assetDecimals);

    const now = BigInt(event.block.timestamp);
    const elapsedTime = now - stream.lastAdjustmentTimestamp;
    const streamedAmount = stream.ratePerSecond * elapsedTime;
    const snapshotAmount = stream.snapshotAmount + streamedAmount;
    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);

    const notWithdrawnAmount = snapshotAmount - withdrawnAmount;

    // If the entire available amount is refunded, the stream starts accruing now.
    const extraAmount = scaledAvailableAmount - notWithdrawnAmount;
    let depletionTime: bigint = now;
    if (extraAmount !== 0n || stream.ratePerSecond !== 0n) {
      depletionTime = now + extraAmount / stream.ratePerSecond;
    }

    stream = {
      ...stream,
      availableAmount,
      depletionTime,
      refundedAmount,
    };
    context.Stream.set(stream);

    /* --------------------------------- ACTION --------------------------------- */
    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Refund,
      addressA: event.params.sender,
      amountA: event.params.amount,
      streamId: stream.id,
    });
  },
});
