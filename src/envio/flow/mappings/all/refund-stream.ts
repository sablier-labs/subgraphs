import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_RefundFromFlowStream_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
import { scale } from "@envio-flow/helpers";
import { Store } from "@envio-flow/store";
import { Flow as enums } from "@src/schema/enums";
import { Loader } from "../loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

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
  await Store.Action.create(context, event, watcher, {
    category: enums.ActionCategory.Refund,
    addressA: event.params.sender,
    amountA: event.params.amount,
    streamId: stream.id,
  });
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const handlerWithLoader = { loader: Loader.base, handler };

SablierFlow_v1_0.RefundFromFlowStream.handlerWithLoader(handlerWithLoader);

SablierFlow_v1_1.RefundFromFlowStream.handlerWithLoader(handlerWithLoader);
