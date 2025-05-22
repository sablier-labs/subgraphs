import { SablierFlow_v1_0, SablierFlow_v1_1 } from "@envio-flow/bindings";
import type { SablierFlow_v1_0_DepositFlowStream_handler as Handler } from "@envio-flow/bindings/src/Types.gen";
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

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

const input = { handler, loader: Loader.base };

SablierFlow_v1_0.DepositFlowStream.handlerWithLoader(input);

SablierFlow_v1_1.DepositFlowStream.handlerWithLoader(input);
