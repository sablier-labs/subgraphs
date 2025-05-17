import { SablierFlow_v1_0 } from "@envio/flow/bindings";
import { createEntityAction, getStreamOrThrow, getWatcherOrThrow } from "@envio/flow/entities";
import { scale } from "@envio/flow/helpers";
import { Flow as enums } from "@src/schema/enums";

SablierFlow_v1_0.DepositFlowStream.handlerWithLoader({
  /* -------------------------------------------------------------------------- */
  /*                                   LOADER                                   */
  /* -------------------------------------------------------------------------- */
  loader: async ({ context, event }) => {
    const stream = await getStreamOrThrow(context, event, event.params.streamId);
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
    const depositedAmount = stream.depositedAmount + event.params.amount;
    const availableAmount = stream.availableAmount + event.params.amount;
    const scaledAvailableAmount = scale(availableAmount, stream.assetDecimals);

    const now = BigInt(event.block.timestamp);
    const elapsedTime = now - stream.lastAdjustmentTimestamp;
    const snapshotAmount = stream.snapshotAmount + stream.ratePerSecond * elapsedTime;
    const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
    const notWithdrawnAmount = snapshotAmount - withdrawnAmount;

    // If the stream still has debt, mimic the contract behavior.
    let depletionTime = stream.depletionTime;
    if (scaledAvailableAmount > notWithdrawnAmount) {
      const extraAmount = scaledAvailableAmount - notWithdrawnAmount;

      if (stream.ratePerSecond > 0) {
        depletionTime = now + extraAmount / stream.ratePerSecond;
      }
    }

    stream = {
      ...stream,
      availableAmount,
      depositedAmount,
      depletionTime,
    };
    context.Stream.set(stream);

    /* --------------------------------- ACTION --------------------------------- */
    await createEntityAction(context, watcher, event, {
      category: enums.ActionCategory.Deposit,
      addressA: event.params.funder,
      amountA: event.params.amount,
      streamId: stream.id,
    });
  },
});
