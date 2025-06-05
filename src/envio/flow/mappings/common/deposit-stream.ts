import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_DepositFlowStream_handler as Handler } from "../../bindings/src/Types.gen";
import { scale } from "../../helpers";
import { Store } from "../../store";
import { Loader } from "./loader";

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  let { stream, watcher } = loaderReturn;
  Store.Stream.exists(stream, event, event.params.streamId);

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
    depletionTime,
    depositedAmount,
  };
  context.Stream.set(stream);

  /* --------------------------------- ACTION --------------------------------- */
  await Store.Action.create(context, event, watcher, {
    addressA: event.params.funder,
    amountA: event.params.amount,
    category: enums.ActionCategory.Deposit,
    streamId: stream.id,
  });
};

export const depositStream = { handler, loader: Loader.base };
