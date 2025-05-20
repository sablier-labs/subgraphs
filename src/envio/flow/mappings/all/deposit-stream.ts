import { FlowCommon } from "@envio-flow/bindings";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

FlowCommon.DepositFlowStream.handlerWithLoader({
  loader: Loader.base,
  handler: async ({ context, event, loaderReturn }) => {
    const watcher = loaderReturn.watcher;
    let stream = loaderReturn.stream;

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
    await Store.Action.create(context, event, watcher, {
      category: enums.ActionCategory.Deposit,
      addressA: event.params.funder,
      amountA: event.params.amount,
      streamId: stream.id,
    });
  },
});
