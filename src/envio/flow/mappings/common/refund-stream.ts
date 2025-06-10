import { Flow as enums } from "../../../../schema/enums";
import type {
  SablierFlow_v1_0_RefundFromFlowStream_handler as Handler_v1_0,
  SablierFlow_v1_1_RefundFromFlowStream_handler as Handler_v1_1,
} from "../../bindings/src/Types.gen";
import { scale } from "../../helpers";
import { Store } from "../../store";
import { Loader } from "./loader";

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  let { stream, watcher } = loaderReturn;
  Store.Stream.exists(event, event.params.streamId, stream);
  Store.Watcher.exists(event.chainId, watcher);

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
  if (extraAmount !== 0n && stream.ratePerSecond !== 0n) {
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
  await Store.Action.create(context, event, watcher, {
    addressA: event.params.sender,
    amountA: event.params.amount,
    category: enums.ActionCategory.Refund,
    streamId: stream.id,
  });
};

export const refundStream = { handler, loader: Loader.base };
