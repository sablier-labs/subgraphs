import { Flow as enums } from "../../../../schema/enums";
import type { SablierFlow_v1_0_VoidFlowStream_handler as Handler } from "../../bindings/src/Types.gen";
import { scale } from "../../helpers";
import { Store } from "../../store";
import { Loader } from "./loader";

/* -------------------------------------------------------------------------- */
/*                                   HANDLER                                  */
/* -------------------------------------------------------------------------- */

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const watcher = loaderReturn.watcher;
  let stream = loaderReturn.stream;

  /* --------------------------------- STREAM --------------------------------- */

  // Void is actually an adjustment with the new rate set to zero.
  const now = BigInt(event.block.timestamp);
  const elapsedTime = now - stream.lastAdjustmentTimestamp;
  const streamedAmount = stream.ratePerSecond * elapsedTime;
  const snapshotAmount = stream.snapshotAmount + streamedAmount;

  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const maxAvailable = withdrawnAmount + availableAmount;

  stream = {
    ...stream,
    depletionTime: 0n,
    forgivenDebt: event.params.writtenOffDebt,
    lastAdjustmentTimestamp: BigInt(event.block.timestamp),
    paused: true,
    pausedTime: BigInt(event.block.timestamp),
    ratePerSecond: 0n,
    snapshotAmount: maxAvailable < snapshotAmount ? maxAvailable : snapshotAmount,
    voided: true,
    voidedTime: BigInt(event.block.timestamp),
  };

  /* --------------------------------- ACTION --------------------------------- */
  const action = await Store.Action.create(context, event, watcher, {
    addressA: event.params.recipient,
    addressB: event.params.sender,
    amountA: event.params.newTotalDebt,
    amountB: event.params.writtenOffDebt,
    category: enums.ActionCategory.Void,
    streamId: stream.id,
  });
  stream = {
    ...stream,
    lastAdjustmentAction_id: action.id,
    pausedAction_id: action.id,
    voidedAction_id: action.id,
  };
  context.Stream.set(stream);
};

/* -------------------------------------------------------------------------- */
/*                                  MAPPINGS                                  */
/* -------------------------------------------------------------------------- */

export const voidStream = { handler, loader: Loader.base };
