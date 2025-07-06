import { CommonStore } from "../../../common/store";
import type { Entity } from "../../bindings";
import type {
  SablierFlow_v1_0_VoidFlowStream_handler as Handler_v1_0,
  SablierFlow_v1_1_VoidFlowStream_handler as Handler_v1_1,
} from "../../bindings/src/Types.gen";
import { scale } from "../../helpers";
import { Store } from "../../store";
import { Loader } from "./loader";

type Handler<T> = Handler_v1_0<T> & Handler_v1_1<T>;

const handler: Handler<Loader.BaseReturn> = async ({ context, event, loaderReturn }) => {
  const { stream, watcher } = loaderReturn;

  /* --------------------------------- STREAM --------------------------------- */

  // Void is actually an adjustment with the new rate set to zero.
  const now = BigInt(event.block.timestamp);
  const elapsedTime = now - stream.lastAdjustmentTimestamp;
  const streamedAmount = stream.ratePerSecond * elapsedTime;
  const snapshotAmount = stream.snapshotAmount + streamedAmount;

  const withdrawnAmount = scale(stream.withdrawnAmount, stream.assetDecimals);
  const availableAmount = scale(stream.availableAmount, stream.assetDecimals);
  const maxAvailable = withdrawnAmount + availableAmount;

  let updatedStream: Entity.Stream = {
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
    category: "Void",
    streamId: stream.id,
  });
  updatedStream = {
    ...updatedStream,
    lastAdjustmentAction_id: action.id,
    pausedAction_id: action.id,
    voidedAction_id: action.id,
  };
  context.Stream.set(updatedStream);

  /* --------------------------------- WATCHER -------------------------------- */
  await CommonStore.Watcher.incrementActionCounter(context, watcher);
};

export const voidStream = { handler, loader: Loader.base };
